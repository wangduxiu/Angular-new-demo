import {Injectable, Injector} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {ColdSubject} from 'app/core/guards/cold-subject';
import {logger} from 'app/core/util/logger';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs/Subject';

interface _EnrichedGuard {
  depth: number;
  guards: any[];
  data: any;
}

function isDependencyTreeCanActivate(object: any): object is DependencyTreeCanActivate {
  return typeof object === 'object' && typeof object['getDependencies'] === 'function';
}

// Put depending guards before actual guard
const createArrayForGuardAndDependencies: ((injector: Injector, guard: any, depth: number, dataParent?: any) => _EnrichedGuard[]) = (injector, guard, depth, dataParent = null) => {
  let result = [{
    depth,
    guards: [guard],
    data: dataParent
  }];
  if (isDependencyTreeCanActivate(guard)) {
    if (depth >= 20) {
      throw 'CIRCULAR DEPENDENCY';
    }
    let data = {
      ...(dataParent || {}),
      ...(guard.getDependencyRouteData() || {})
    };
    if (Object.keys(data).length === 0) {
      data = null;
    }
    result[0].data = data;
    guard.getDependencies().forEach((gc) => {
      const g = injector.get(gc);
      result.splice(result.length - 1, 0, ...createArrayForGuardAndDependencies(injector, g, +depth + 1, data));
    });
  }
  return result;
};


export interface DependencyTreeCanActivate extends CanActivate {
  getDependencies(): any;

  getDependencyRouteData(): any;
}

@Injectable()
export class DependencyTreeGuard implements CanActivate {

  constructor(protected router: Router,
              protected injector: Injector) {
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    logger.debug(`In HierarchicalRouteGuard ${route.url}`);

    let routeGuardDepths = route.data.guards.reduce((newArray, guardClass) => {
      const guard = this.injector.get(guardClass);
      const data = {...route.data};
      delete data.guards;

      return [
        ...newArray,
        ...createArrayForGuardAndDependencies(this.injector, guard, 1, data)
      ];
    }, []);

    // Remove double guards
    // routeGuardDepths: array of {depth, guards: []}
    routeGuardDepths = routeGuardDepths.filter((guardWithDepth, i) => {
      const firstSimilarGwd = routeGuardDepths.find(r => r.guards[0] === guardWithDepth.guards[0]);
      const highestDepth = routeGuardDepths.filter(rwg => rwg.guards[0] === firstSimilarGwd.guards[0]).reduce((maxDepth, rwg) => Math.max(maxDepth, rwg.depth), 0);
      firstSimilarGwd.depth = highestDepth;
      return routeGuardDepths.indexOf(firstSimilarGwd) === i;
    });

    // Combine guards with same depth, put all in arrays in array
    routeGuardDepths = routeGuardDepths.filter((guardWithDepth, i) => {
      const firstWithSimilarDepthGwd = routeGuardDepths.find(r => r.depth === guardWithDepth.depth);
      let currentIsTheFirst = routeGuardDepths.indexOf(firstWithSimilarDepthGwd) === i;

      if (currentIsTheFirst) {
        // Every rwg with same depth, put guards in array of first one
        const mergedGuards = routeGuardDepths
          .filter(rwg => rwg.depth === firstWithSimilarDepthGwd.depth)
          .reduce((array, rwg) => [...array, ...rwg.guards], []);
        firstWithSimilarDepthGwd.guards = mergedGuards;
      }
      return currentIsTheFirst;
    });

    // Order on depth.  Deepest depth first
    routeGuardDepths.sort((o1, o2) => o2.depth - o1.depth);

    // Map back to array of array (sequential & parallel guards
    const groupedRoutes = routeGuardDepths.map(rwg => rwg.guards);

    const subject = new Subject<boolean>();
    if (routeGuardDepths) {
      // Convert guards into canActivate-observables
      let observablesToWatch: Observable<boolean[]>[];
      const thiz = this;
      observablesToWatch = routeGuardDepths.map(enrichedGuard => Observable.forkJoin(enrichedGuard.guards.map(guard => {
        return new ColdSubject(() => {
          let newRoute = route;
          if (isDependencyTreeCanActivate(guard)) {
            // Proxy the route so that
            newRoute = new Proxy(route, {
              get: function (obj, prop) {
                if (prop === 'data') {
                  let data = {
                    ...enrichedGuard.data,
                    ...(guard.getDependencyRouteData() || {})
                  };
                  return data;
                } else
                  return prop in obj ? obj[prop] : undefined;
              }
            });
          }
          const observable = guard.canActivate(newRoute, state);
          return observable;
        });
      })));

      const recursiveChecker = () => {
        if (observablesToWatch.length) {
          const observable = observablesToWatch.splice(0, 1)[0];
          observable
            .delay(0) // Make it async
            .subscribe(bools => {
              const allSuccessfull = bools.reduce((res, b) => res && b, true);
              if (!allSuccessfull) {
                subject.next(false);
                subject.complete();
              } else {
                recursiveChecker();
              }
            });
        } else {
          subject.next(true);
          subject.complete();
        }
      };

      recursiveChecker();
    }

    return subject.asObservable();
  }
}

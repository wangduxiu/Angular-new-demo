// tslint:disable max-line-length
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot} from '@angular/router';
import {ColdSubject} from 'app/core/guards/cold-subject';
import {logger} from 'app/core/util/logger';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

export interface Params { [key: string]: string };

let uniqueIndex = 0;
/**
 * Parent class that contains the algorithm for a guard. It's suitable for parts of the state that are typed as LoadStatefulData (loading, loaded, failed, data)
 * Just implement 4 methods and you're done
 */
export abstract class BaseGuard<T> implements CanActivate, CanActivateChild {

  constructor(private name: string) {}

  private getFromStoreOrAPI(params: Params, pathForLogging: string, index: number) {
    // For a certain ID, first get versions-list
    // then load latest version as detail

    let apiDetailCalled = false;
    let inspecting = true;
    const destroyed$ = new Subject<void>();

    return this.getState(params)
    /*
  ends in an error: ERROR Error: Uncaught (in promise): EmptyError: no elements in sequence
  due to old version of rxjs presumably, so I fixed in another way
      .takeWhile(() => {
        return inspecting;
      })
*/
      .distinctUntilChanged((v1, v2) => this.didntChange(v1, v2))
      .filter(detail => { // go back to start if still loading
        logger.debug(() => `BaseGuard<${this.name}> in filter ${inspecting ? '' : '(not inspecting, path ' + pathForLogging + ' - ' + index + ')'} stopped: ${destroyed$.isStopped}`);
        return !inspecting || !this.isLoading(detail, params);
      })
      .filter(detail => { // go back to start if loaded but wrong version
        if (inspecting && this.isLoaded(detail, params)) {
          if (!apiDetailCalled) {
            if (!this.versionChecker(detail, params)) {
              this.resetter(params);
              return false; // Detail was loaded but wrong ID and didn't try yet => reset & go back to start
            }
          }
        }
        return true; // Detail was loaded for correct ID or wasn't loaded at all
      })
      .filter(detail => { // Stop if detail not yet loaded
        if (!inspecting || this.hasFailed(detail, params)) {
          return true;
        }
        if (!this.isLoaded(detail, params)) {
          if (!apiDetailCalled || this.tryAgain(params)) {
            this.loader(params);
            apiDetailCalled = true;
            return false; // Detail not yet loaded & didn't try yet & versions list was correctly loaded => trigger load detail & go back to start
          }
        }
        return true; // Detail was already loaded or versions weren't correctly loaded
      })
      .map(detail => { // ok, now it should be loaded or it should be failed
        if (!inspecting) {
          return false;
        }
        inspecting = false;
        destroyed$.complete();
        return this.isLoaded(detail, params);
      })
      .take(1);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return new ColdSubject(() => {
      const startTimer = new Date().getTime();
      uniqueIndex++;
      logger.debug(() => `BaseGuard<${this.name}> start for route ${route.routeConfig.path}, index ${uniqueIndex}`);
      return this.getFromStoreOrAPI(route.params, route.routeConfig.path, uniqueIndex)
        .switchMap((correctlyLoaded: boolean) => {
          if (!correctlyLoaded) {
            this.navigateAway(route.params);
          }
          const duration = new Date().getTime() - startTimer;
          logger.debug(`BaseGuard<${this.name}> took ${duration} ms, result: ${correctlyLoaded}`);
          return Observable.of(correctlyLoaded);
        })
        .catch((err) => {
          console.error(err);
          const duration = new Date().getTime() - startTimer;
          logger.debug(`BaseGuard<${this.name}> took ${duration} ms and ended with an error`);
          return Observable.of(false);
        })
    })
  }

  /**
   * Used to check if the loaded version is the correct one
   * @param t the object to test
   * @param params the path parameters coming from the route
   * @returns boolean: true if equal, false if not
   */
  abstract versionChecker(t: T, params: Params): boolean;

  /**
   * Used to trigger a load
   * @param params the query parameters coming from the route
   */
  abstract loader(params: Params): void;

  /**
   * Used to trigger a reset part of the state
   * @param params the query parameters coming from the route
   */
  abstract resetter(params: Params): void;

  /**
   * Getter that returns a LoadStatefulData part of the state that will be manipulated
   * @returns observable streaming part of the state that matters
   */
  abstract getState(params: Params): Observable<T>;

  abstract isLoading(t: T, params: Params): boolean;
  abstract hasFailed(t: T, params: Params): boolean;
  abstract isLoaded(t: T, params: Params): boolean;
  abstract navigateAway(params: Params): void;
  tryAgain(params: Params): boolean {
    return false;
  }

  didntChange(v1: T, v2: T) {
    return v1 === v2;
  }
}

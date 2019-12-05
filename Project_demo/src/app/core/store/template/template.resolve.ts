import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {CustomerInfoLoadGuard} from 'app/core/guards/customer-info-load.guard';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import {RootState} from '../index';
import {TemplatesLoadAction} from './template.actions';
import {TemplateState} from './template.interface';

/**
 * Guard to async load the templates before following a route
 */
export class GetTemplatesGuard implements CanActivate, DependencyTreeCanActivate {

  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.store
      .filter((root: fromRoot.RootState) => root.session.userContext.contextLoaded)
      .take(1)
      .switchMap((root: RootState) => {
        this.store.dispatch(new TemplatesLoadAction({ type: route.data.type }));
        return this.store.select('template')
          .filter((template: TemplateState) => template.loadSuccess)
          .take(1)
          .switchMap(() => {
            return Observable.of(true)
          });
      });
  }

  getDependencies(): any {
    return [CustomerInfoLoadGuard];
  }

  getDependencyRouteData(): any {
  }
}

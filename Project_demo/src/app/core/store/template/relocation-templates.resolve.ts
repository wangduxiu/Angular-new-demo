import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {UserContextLoadGuard} from 'app/core/guards/user-context-load.guard';
import {GetDefinitionsGuard} from 'app/core/store/definitions/definitions.resolve';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import {RootState} from '../index';
import {TemplatesLoadAction} from './template.actions';
import {TemplateState} from './template.interface';

/**
 * Guard to async load the templates before following a route
 */
export class GetRelocationTemplatesGuard implements CanActivate, DependencyTreeCanActivate {

  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.store
      .take(1)
      .switchMap((root: RootState) => {
        this.store.dispatch(new TemplatesLoadAction({ type: 'RELOCATION' }));
        return this.store.select('template')
          .filter((template: TemplateState) => template.loadSuccess)
          .take(1)
          .switchMap(() => {
            return Observable.of(true)
          });
      });
  }

  getDependencies(): any {
    return [UserContextLoadGuard, AuthorizationGuard, GetDefinitionsGuard];
  }

  getDependencyRouteData(): any {
    return {
      authorization:'canRelocate'
    }
  }
}

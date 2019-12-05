import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {UserContextLoadGuard} from 'app/core/guards/user-context-load.guard';
import {logger} from 'app/core/util/logger';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '../..';
import * as actions from './i18n.actions';

/**
 * Guard to async load an order before following a route
 */
export class ResetI18nGuard implements CanActivate, DependencyTreeCanActivate {
  private store:Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):Observable<boolean> | Promise<boolean> | boolean {
    logger.debug('In ResetI18nGuard');

    return this.store
      .take(1)
      .switchMap(root => {
        if (route.data.reset === 'all') {
          this.store.dispatch(new actions.LanguageResetServerAction());
        }
        if (route.data.reset === 'missing') {
          this.store.dispatch(new actions.LanguageSetMissingServerAction());
        }
        this.store.dispatch(go('/admin/i18n'));
        return Observable.of(false);
      })
  }

  getDependencies(): any {
    return [UserContextLoadGuard];
  }

  getDependencyRouteData(): any {
  }
}

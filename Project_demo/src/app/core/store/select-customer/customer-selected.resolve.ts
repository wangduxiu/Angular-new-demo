import { forwardRef, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { logger } from 'app/core/util/logger';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from '..';

/**
 * Guard to synchronously clear orders filter & result
 */
export class CustomerSelectedGuard implements CanActivate {

  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    logger.debug('In CustomerSelectedGuard');
    return this.store.select('session')
      .take(1)
      .map((session: any) => !!(session.activeCustomer && session.activeCustomer.id));
  }
}

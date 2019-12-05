import { forwardRef, Inject } from '@angular/core';
import { CanActivate } from '@angular/router';
import { go } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { AppSettings } from 'app/app.settings';
import { UserContextLoadAction } from 'app/core/store/user-context/user-context.actions';
import { UserContext } from 'app/core/store/user-context/user-context.interface';
import { logger } from 'app/core/util/logger';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from '../store';
import { BaseGuard } from './base.guard';

export class UserContextLoadGuard extends BaseGuard<UserContext> implements CanActivate {

  private store: Store<fromRoot.RootState>;

  constructor(
    @Inject(forwardRef(() => Store)) store,
  ) {
    super('UserContextLoadGuard');
    this.store = store;
  }

  getState(): Observable<UserContext> {
    return this.store.map(state => state.session.userContext);
  }

  hasFailed(t: UserContext): boolean {
    return false;
  }

  isLoaded(t: UserContext): boolean {
    return t.contextLoaded;
  }

  isLoading(t: UserContext): boolean {
    return t.contextLoading;
  }

  loader(params: { [p: string]: string }): void {
    logger.debug('In UserContextLoadGuard loader (dispatch)');
    this.store.dispatch(new UserContextLoadAction());
  }

  resetter(params: { [p: string]: string }): void {
  }

  versionChecker(t: UserContext, params: { [p: string]: string }): boolean {
    return true;
  }

  navigateAway(): void {
    this.store.dispatch(go([AppSettings.PUBLIC_PAGE_ROUTE]));
  }

}

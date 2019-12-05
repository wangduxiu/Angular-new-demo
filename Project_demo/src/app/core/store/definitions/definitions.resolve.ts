import { forwardRef, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { logger } from 'app/core/util/logger';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from '..';
import { RootState } from '../index';
import { DefinitionsLoadAction } from './definitions.actions';
import { Definitions } from './definitions.interface';

/**
 * Guard to async load the definitions before following a route
 */
export class GetDefinitionsGuard implements CanActivate {

  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.store
      .filter((root: fromRoot.RootState) => root.session.userContext.contextLoaded)
      .take(1)
      .switchMap((root: RootState) => {
        logger.debug('inner GetDefinitionsGuard');
        if (root.definitions.loaded)
          return Observable.of(true);

        this.store.dispatch(new DefinitionsLoadAction({language: root.session.userContext.language}));
        return this.store.select('definitions')
          .filter((definitions: Definitions) => definitions.loaded)
          .take(1)
          .switchMap(() => Observable.of(true));
      });
  }
}

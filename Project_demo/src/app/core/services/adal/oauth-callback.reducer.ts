import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { logger } from 'app/core/util/logger';
import { AppSettings } from '../../../app.settings';
import * as fromRoot from '../../store';
import { AdalLoginFailureAction, AdalLoginSuccessAction } from '../../store/adal/adal.actions';
import { AdalService } from './adal.service';

/**
 * Used for callbacks with id_token or access_token in url.  It will store the tokens in local session store
 *
 * Login -> leave page, go to azure ad login screen, come back with id_token.
 * Rest-call -> request access_token (bearer token) via iframe (adal.js takes care of it).  No visual effect on page since iframe is hidden.  only if no access_token or access_token almost expired.
 */
@Injectable()
export class OAuthCallbackReducer implements CanActivate {
  constructor(private router: Router, private adalService: AdalService, private store: Store<fromRoot.RootState>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    logger.debug('In OAuthCallbackReducer');
    this.adalService.handleCallback(); // fetches id_token or access_token from url and stores it in local storage
    if (this.adalService.isAuthenticated) {

      // Fire login success
      this.store.dispatch(new AdalLoginSuccessAction({ username: this.adalService.userInfo.userName }));

      // Navigate to target or default route
      const returnUrl = route.queryParams['returnUrl'];
      if (!returnUrl) {
        this.router.navigate([AppSettings.DEFAULT_ROUTE]); // To the default protected page
      } else {
        this.router.navigate([returnUrl], { queryParams: route.queryParams });
      }
    } else {
      // Fire login fail
      this.store.dispatch(new AdalLoginFailureAction());
      // Navigate to public page
      this.router.navigate([AppSettings.PUBLIC_PAGE_ROUTE]);
    }
    return false; // Don't go to the dummy component ...
  }
}

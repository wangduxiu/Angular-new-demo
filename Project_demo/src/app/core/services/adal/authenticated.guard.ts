import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationExtras, Router, RouterStateSnapshot } from '@angular/router';
import { logger } from 'app/core/util/logger';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../../app.settings';
import { AdalService } from './adal.service';

/**
 * Used in route-config to guard certain paths, make them only accessible when logged in
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private router: Router, private adalService: AdalService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    logger.debug('In AuthenticationGuard');
    if (!this.adalService.isAuthenticated) {
      const navigationExtras: NavigationExtras = {
        queryParams: { redirectUrl: route.url },
      };
      this.router.navigate([AppSettings.PUBLIC_PAGE_ROUTE], navigationExtras);
    }

    return true;
  }
}

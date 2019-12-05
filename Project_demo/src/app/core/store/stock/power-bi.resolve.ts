import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {GetDefinitionsGuard} from 'app/core/store/definitions/definitions.resolve';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import * as actions from './stock.actions';
import {CustomerInfoLoadGuard} from '../../guards/customer-info-load.guard';

/**
 * Guard to async load the Power BI url before following a route
 */
export class GetPowerBIUrlGuard implements CanActivate, DependencyTreeCanActivate {

  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.store.take(1).switchMap((root: fromRoot.RootState) => {
      if (root.stock.powerBIConfig.loaded) {
        return Observable.of(true);
      }

      this.store.dispatch(new actions.PowerBIUrlLoadAction());
      return this.store
        .debounce((root) => Observable.interval(root.stock.powerBIConfig.loaded && 1 || 200)) // Give ngrx effects the time to start new actions so that things that need to be loaded can start loading
        .filter((root: fromRoot.RootState) => !root.stock.powerBIConfig.loading)
        .take(1)
        .switchMap(root => {
          return Observable.of(root.stock.powerBIConfig.loaded)
        });
    })
  }

  getDependencies(): any {
    return [
      AuthorizationGuard,
      GetDefinitionsGuard,
      CustomerInfoLoadGuard,
    ];
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'STOCK.GET_CURRENT_STOCK_LIST'
    }
  }

}

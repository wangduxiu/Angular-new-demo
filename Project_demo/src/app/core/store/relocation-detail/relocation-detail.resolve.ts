import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {GetDefinitionsGuard} from 'app/core/store/definitions/definitions.resolve';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import * as actions from './relocation-detail.actions';
import {EditRelocationDetail} from './relocation-detail.interface';

/**
 * Guard to async load an order before following a route
 */
export class GetRelocationGuard implements CanActivate, DependencyTreeCanActivate {
  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.store
      .filter((root: fromRoot.RootState) => root.session.userContext.contextLoaded)
      .take(1)
      .switchMap(root => {
        if (root.session.userContext.canRelocate) {
          this.store.dispatch(new actions.RelocationDetailOpen({ salesOrderNumber: route.params.salesOrderNumber !== 'null' ? route.params.salesOrderNumber : null, etmOrderNumber: route.params.etmOrderNumber }));
          return this.store
            .select('editRelocationDetail')
            .filter((editRelocationDetail: EditRelocationDetail) => !editRelocationDetail.mode.loading)
            .take(1)
            .map((editRelocationDetail: EditRelocationDetail) => editRelocationDetail.mode.loadSuccess);
        } else {
          return Observable.of(false);
        }
      })
  }
  getDependencies(): any {
    return [
      AuthorizationGuard,
      GetDefinitionsGuard,
    ];
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'canRelocate'
    }
  }
}

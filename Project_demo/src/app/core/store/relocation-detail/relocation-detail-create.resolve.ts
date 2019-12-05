import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {GetDefinitionsGuard} from 'app/core/store/definitions/definitions.resolve';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {RelocationTemplateCreateStart} from 'app/core/store/template/template.actions';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import {RelocationDetailCreateStart} from './relocation-detail.actions';

export class CreateRelocationGuard implements CanActivate, DependencyTreeCanActivate {
  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    if (route.data.createTemplate) {
      this.store.dispatch(new RelocationTemplateCreateStart({ activeCustomer: null }));
    } else {
      this.store.dispatch(new RelocationDetailCreateStart({ date: route.queryParams && route.queryParams.date }));
    }
    return Observable.of(true);
  }
  getDependencies(): any {
    return [
      AuthorizationGuard,
      GetDefinitionsGuard
    ];
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'canRelocate'
    }
  }
}

import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {GetDefinitionsGuard} from 'app/core/store/definitions/definitions.resolve';
import {RelocationDetailCreateFromTemplate} from 'app/core/store/relocation-detail/relocation-detail.actions';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import {TemplateRestService} from '../../services/rest/template.rest.service';

/**
 * Guard to async load an order before following a route
 */
export class CreateRelocationFromTemplateGuard implements CanActivate, DependencyTreeCanActivate {
  private templateRestService: TemplateRestService;
  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store, @Inject(forwardRef(() => TemplateRestService)) templateRestService) {
    this.store = store;
    this.templateRestService = templateRestService;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.templateRestService.getTemplate('RELOCATION', route.params.templateId).switchMap(template => {
      // Reducer to store in state
      this.store.dispatch(new RelocationDetailCreateFromTemplate({ template, date: route.queryParams.date }));
      // Go to /orders/copy
      this.store.dispatch(go('/relocations/copy'));
      return Observable.of(true);
    });
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

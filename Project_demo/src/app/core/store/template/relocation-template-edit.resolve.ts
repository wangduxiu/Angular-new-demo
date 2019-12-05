import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {GetDefinitionsGuard} from 'app/core/store/definitions/definitions.resolve';
import {EditRelocationDetail} from 'app/core/store/relocation-detail/relocation-detail.interface';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import {TemplateRestService} from '../../services/rest/template.rest.service';
import * as actions from './template.actions';

/**
 * Guard to async load a template before following a route
 */
export class EditRelocationTemplateGuard implements CanActivate, DependencyTreeCanActivate {
  private templateRestService: TemplateRestService;
  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store, @Inject(forwardRef(() => TemplateRestService)) templateRestService) {
    this.store = store;
    this.templateRestService = templateRestService;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.store.select('editRelocationDetail').take(1).switchMap((editRelocationDetail: EditRelocationDetail) => {
      if (editRelocationDetail.relocationDetail.templateId === route.params.templateId) { // Template already loaded (coming from calendar)
        this.triggerCalculateTruckLoad(editRelocationDetail.relocationDetail.materials[0]);
        return Observable.of(true);
      } // else, page refresh, entered portal with url for editing template, first load the template
      return this.templateRestService.getTemplate('RELOCATION', route.params.templateId).switchMap(template => {
        const templateData = template.data;
        this.store.dispatch(new actions.RelocationTemplateEditAction({ template }));
        this.triggerCalculateTruckLoad(templateData.lineItem[0]);
        return Observable.of(true);
      });
    });
  }

  private triggerCalculateTruckLoad(lineItem) {
    // TODO what to do with this ???
    // this.store.dispatch(new orderActions.OrderDetailCreateSaveMaterialStart({ material: lineItem, preventRestCall: false, showPopup: false }));
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

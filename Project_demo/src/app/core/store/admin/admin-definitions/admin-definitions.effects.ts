import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { ADMIN_DEFINITIONS_LOAD, AdminDefinitionsLoadAction, AdminDefinitionsLoadFailAction, AdminDefinitionsLoadSuccessAction } from './admin-definitions.actions';
import { AdminDefinitionRestService } from '../../../services/rest/admin/admin-definition.rest.service';
import { AdalService } from '../../../services/adal/adal.service';
import { TranslateService } from '@ngx-translate/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Injectable()
export class AdminDefinitionsEffects {

  constructor(private actions$: Actions, private adminDefinitionRestService: AdminDefinitionRestService, private adalService: AdalService, private translateService: TranslateService) {
  }

  @Effect()
  loadAdminDefinitions$: Observable<Action> = this.actions$
    .ofType(ADMIN_DEFINITIONS_LOAD)
    .filter(action => this.adalService.isAuthenticated)
    .switchMap(action =>                                                   // Register to this event, unregister previous if new event occurs.
      this.adminDefinitionRestService.getAdminDefinitions(action.payload.language)   // Request orders
        .map(adminDefinitions => new AdminDefinitionsLoadSuccessAction({ 
          adminDefinitions, 
          roles: this.translateService.instant('ADMIN.ROLES'), 
        }))
        .catch((err) => {
          return Observable.of(new AdminDefinitionsLoadFailAction(err));
        }),
    );
}

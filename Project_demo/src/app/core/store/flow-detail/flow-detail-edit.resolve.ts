import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {CustomerInfoLoadGuard} from 'app/core/guards/customer-info-load.guard';
import {ColdSubject} from 'app/core/guards/cold-subject';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {FlowSandbox} from 'app/core/sandboxes/flow.sandbox';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import {FlowRestService} from '../../services/rest/flow.rest.service';
import {CDFlorderType, CDTo} from '../contract-details/contract-details.interface';
import {FlowDetailTO} from '../florder-detail/florder-detail.interface';

/**
 * Guard to async load a flow before following a route
 *
 **/

export class EditFlowGuard implements CanActivate, DependencyTreeCanActivate {
  private flowRestService: FlowRestService;
  private store: Store<fromRoot.RootState>;
  private sandbox: FlowSandbox;

  constructor(@Inject(forwardRef(() => Store)) store, @Inject(forwardRef(() => FlowRestService)) flowRestService, @Inject(forwardRef(() => FlowSandbox)) sandbox,) {
    this.store = store;
    this.flowRestService = flowRestService;
    this.sandbox = sandbox;
  }

  private findTo(florderTypes: CDFlorderType[], flow: FlowDetailTO): CDTo {
    const flowType: CDFlorderType = florderTypes.find(flowType => flowType.id === flow.flowType);
    const from = flowType && flowType.shippingConditions[0].froms.find(from => from.id === flow.from.id);
    return from && from.tos.find(to => to.id === flow.to.id);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return new ColdSubject(() => {
      let result;
      if (route.data.accept) {
        result = this.sandbox.updateFlow(route.params.etmOrderNumber);
      } else {
        result = this.sandbox.editFlow(route.params.etmOrderNumber);
      }
      return result;
    });
  }

  getDependencies(): any {
    return [
      CustomerInfoLoadGuard,
      AuthorizationGuard
    ];
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'FLOW.UPDATE'
    }
  }
}

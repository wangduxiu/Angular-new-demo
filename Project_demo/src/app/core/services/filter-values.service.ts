import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from 'app/core/store';
import { Observable, Subject } from 'rxjs';
import * as ordersActions from '../store/orders/orders.actions';
import { FilterValuesRestService } from './rest/filter-values.rest.service';
import * as flowsActions from '../store/flows/flows.actions';

@Injectable()
export class FilterValuesService {

  constructor(
    private store: Store<RootState>,
    private filterValuesRestService: FilterValuesRestService,
    ) {
  }

  loadOrdersFilterValues(handleFail: Function): Observable<void> {
    const subject = new Subject<void>();
    this.store.take(1).subscribe(state => {
      const activeCustomerId = state.session && state.session.activeCustomer && state.session.activeCustomer.id;
      let customerIds = [];
      if (state.session.userContext.isTransporter) {
        customerIds = state.session.userContext.customers.map(customer => customer.id);

      } else if (state.session && state.session.activeCustomer && state.session.activeCustomer.id){
        customerIds.push(state.session.activeCustomer.id);
      }

      if (customerIds.length) {
        this.store.dispatch(new ordersActions.OrdersFilterValuesLoadAction({ customerIds }));
        this.filterValuesRestService.getOrderFilterValues(activeCustomerId, customerIds).subscribe(
          filterValues => {
            this.store.dispatch(new ordersActions.OrdersFilterValuesLoadSuccessAction({ filterValues, definitions: state.definitions }));
            subject.next();
            subject.complete();
          },
          error => {
            this.store.dispatch(new ordersActions.OrdersFilterValuesLoadFailAction(error));
            handleFail(error);
            subject.error(error);
          })
      } else {
        subject.error('No customer selected');
      }
    });
    return subject.asObservable();
  }

  loadFlowsFilterValues(handleFail: Function): Observable<void> {
    const subject = new Subject<void>();
    this.store.take(1).subscribe(state => {
      const customerId = state.session && state.session.activeCustomer && state.session.activeCustomer.id;

      if (customerId) {
        this.store.dispatch(new flowsActions.FlowsFilterValuesLoadAction({ customerId }));
        this.filterValuesRestService.getFlowFilterValues(customerId).subscribe(
          filterValues => {
            this.store.dispatch(new flowsActions.FlowsFilterValuesLoadSuccessAction({ filterValues, definitions: state.definitions }));
            subject.next();
            subject.complete();
          },
          error => {
            this.store.dispatch(new flowsActions.FlowsFilterValuesLoadFailAction(error));
            handleFail(error);
            subject.error(error);
          })
      } else {
        subject.error('No customer selected');
      }
    });
    return subject.asObservable();
  }

}

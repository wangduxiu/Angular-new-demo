import { Component, HostListener, OnInit } from '@angular/core';
import { go } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { CalendarPageContainer } from 'app/modules/calendar/calendar-page-container/calendar-page.container';
import { DragulaService } from 'ng2-dragula';
import { fadeInAnimation } from '../../../animations';
import { AzureMonitoringService } from '../../../core/services/AzureMonitoringService';
import * as fromRoot from '../../../core/store';
import * as calendarActions from '../../../core/store/calendar/calendar.actions';
import * as orderDetailActions from '../../../core/store/order-detail/order-detail.actions';
import * as templateActions from '../../../core/store/template/template.actions';
import { CalendarDay, FlorderInfo } from '../../../core/store/calendar/calendar.interface';
import { FlordersFilter } from '../../../core/store/florders/florders-filter.interface';

@Component({
  selector: 'app-orders-calendar-page',
  templateUrl: './orders-calendar-page.container.html',
  styleUrls: ['./calendar-page.container.less'],
  animations: [fadeInAnimation],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})

export class OrdersCalendarPageContainer extends CalendarPageContainer implements OnInit {
  height: Number = 0;

  constructor(
    store: Store<fromRoot.RootState>,
    azureMonitoringService: AzureMonitoringService,
    dragulaService: DragulaService,
  ) {
    super(store, azureMonitoringService, dragulaService);

    this.store.dispatch(new orderDetailActions.OrderDetailClear());

    store.takeWhile(() => !this.destroyed).map(state => state.customerInfo).distinctUntilChanged().subscribe(customerInfo => {
      this.restrictions = customerInfo.restrictions;
      this.places = customerInfo.places;
      this.depots = Object.keys(customerInfo.places).filter(p => customerInfo.places[p].isDepot).map(depot => customerInfo.places[depot]);
    });
    store.takeWhile(() => !this.destroyed).map(state => state.contractInfo).distinctUntilChanged().subscribe(contractInfo => {
      this.orderTypes = contractInfo.orderTypes;
    });
  }

  @HostListener('window:resize', ['$event'])

  onResize(event) {
    this.resize(event.currentTarget.innerHeight);
  }

  ngOnInit(): void {
    this.filter = {
      orderTypes: this.definitions.order.type.map(ot => ot.id)
    };
  }

  ngAfterViewInit() {
    this.resize(window.innerHeight);
  }

  resize(innerHeight) {
    this.height = innerHeight - 205;
  }

  loadFlorders(dates: { fromDate: string, toDate: string }) {
    this.filter = {
      ...this.filter,
      unloadingDateFrom: dates.fromDate,
      unloadingDateTo: dates.toDate,
    };
    this.store.dispatch(new calendarActions.CalendarOrdersLoadAction({
      filter: this.filter,
      definitions: this.definitions,
      places: this.places
    }));
  }

  filterCalendar(filter: FlordersFilter) {
    this.filter = filter;
    this.store.dispatch(new calendarActions.CalendarOrdersLoadAction({
      filter,
      definitions: this.definitions,
      places: this.places
    }));
  }

  showFlorderModal(day: CalendarDay) {
    this.store.dispatch(new calendarActions.ShowCreateOrderModalAction({
      day,
      filter: this.filter,
      templates: this.templates.templates,
      definitions: this.definitions,
      places: this.places
    }));
  }

  createFlorder() {
    if (this.authorization.ORDER.CREATE) {
      this.store.dispatch(go(['/orders/new']));
    }
  }

  openFlorder(order: FlorderInfo) {
    if (this.authorization.ORDER.GET) {
      this.store.dispatch(go([`orders/${order.etmOrderNumber}`, {salesOrderNumber: order.salesOrderNumber, back: 'calendar/order'}]));
    }
  }

  requestDeliveryDates() {
    if (this.selectedTemplate) {
      this.store.dispatch(new calendarActions.CalendarRequestOrderDeliveryDatesAction());
    }
  }

  createTemplate() {
    if (this.authorization.ORDER.CREATE) {
      this.store.dispatch(go(['/orders/template/new', {back: 'orders'}]));
    }
  }

  protected createFlorderFromTemplate(templateId: string, date: string) {
    if (this.authorization.ORDER.CREATE) {
      this.store.dispatch(go(`orders/new/fromTemplate/${templateId}`, {date}));
    }
  }

  deleteTemplate(templateId: number) {
    this.store.dispatch(new templateActions.TemplatesDeleteAction({templateId, type: 'ORDER'}));
  }

  editTemplate(templateId: number) {
    this.store.dispatch(new templateActions.TemplatesStartEditAction({templateId, type: 'ORDER'}));
  }
}

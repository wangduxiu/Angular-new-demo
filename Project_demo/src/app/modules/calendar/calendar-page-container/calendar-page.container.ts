import { Store } from '@ngrx/store';
import { DragulaService } from 'ng2-dragula';
import { AzureMonitoringService } from '../../../core/services/AzureMonitoringService';
import * as fromRoot from '../../../core/store';
import * as calendarActions from '../../../core/store/calendar/calendar.actions';
import { CalendarDay, CalendarFlorders, FlorderInfo } from '../../../core/store/calendar/calendar.interface';
import { CDFlorderType, ContractRestrictions } from '../../../core/store/contract-details/contract-details.interface';
import { Definitions } from '../../../core/store/definitions/definitions.interface';
import { AvailablePickingDates, FlorderDetail } from '../../../core/store/florder-detail/florder-detail.interface';
import { Place } from '../../../core/store/florders/place.interface';
import { TemplateState } from '../../../core/store/template/template.interface';
import { util } from '../../../core/util/util';
import { BaseContainer } from '../../base/BaseContainer';
import { FlordersFilter } from '../../../core/store/florders/florders-filter.interface';

export abstract class CalendarPageContainer extends BaseContainer {
  restrictions: ContractRestrictions;
  definitions: Definitions;
  orderTypes: CDFlorderType[];
  places: { [key: string]: Place };

  flordersState: CalendarFlorders;
  templates: TemplateState;
  depots: Place[];
  deliveryDaysRequesting: boolean = false;
  availableDays: AvailablePickingDates;
  selectedTemplate: FlorderDetail;
  florder: FlorderDetail;
  filter: FlordersFilter;

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService, private dragulaService: DragulaService) {
    super(store, azureMonitoringService);

    store.select('calendar').takeWhile(() => !this.destroyed).subscribe((calendarFlorders: CalendarFlorders) => {
      this.flordersState = calendarFlorders;
      this.selectedTemplate = calendarFlorders.selectedTemplate;
      this.deliveryDaysRequesting = calendarFlorders.deliveryDaysRequesting;
      this.availableDays = calendarFlorders.availableDays;
    });

    store.select('definitions').takeWhile(() => !this.destroyed).subscribe((definitions: Definitions) => {
      this.definitions = definitions;
    });

    store.select('template').takeWhile(() => !this.destroyed).subscribe((templates: any) => {
      this.templates = templates;
    });

    dragulaService.setOptions('templates-bag', {
      copy: true,
      revertOnSpill: true,
      // removeOnSpill: true,
      moves: (el, source, handle, sibling) => {
        // prevent dragging of day
        return this.selectedTemplate && !source.classList.contains('day');
      }
    });

    dragulaService.drop.subscribe((value) => {
      this.onDrop(value);
    });

    dragulaService.over.subscribe((value) => {
      this.onOver(value.slice(1));
    });
    dragulaService.out.subscribe((value) => {
      this.onOut(value.slice(1));
    });
  }

  private onOver(args) {
    // simulate the hover effect on the day
    args[1].classList.add('focus');
  }

  private onOut(args) {
    // remove the hover effect when hovering away from the day
    args[1].classList.remove('focus');
  }

  ngOnDestroy() {
    // destroy the templages-bag to avoid memory leaks
    this.dragulaService.destroy('templates-bag');
  }

  abstract requestDeliveryDates();

  selectTemplate(template) {
    this.store.dispatch(new calendarActions.CalendarTemplateSelectedAction(template));

    // request delivery dates for selected template when it is selected
    // not when it is unselected
    if (this.selectedTemplate) {
      this.requestDeliveryDates();
    }
  }

  protected onDrop(value) {
    // only permit drop on day
    if (value[2].dataset.name === 'day') {
      // do not drop the template in the day layout
      value[1].remove();

      // Create template from dragged template and dropped on day
      const templateId = value[1].dataset.id;
      const dayDate = value[2].dataset.id;
      const isAvailableForDelivery = value[2].dataset.canDrop === 'true';
      const date = util.formatDate(new Date(dayDate));

      // check if template can be dropped on this day
      if (isAvailableForDelivery) {
        this.createFlorderFromTemplate(templateId, date);
      }
    }
  }

  abstract createFlorder();

  abstract createTemplate();

  abstract editTemplate(templateId: number);

  abstract deleteTemplate(templateId: number);

  protected abstract showFlorderModal(day: CalendarDay);

  protected abstract openFlorder(florder: FlorderInfo);

  protected abstract loadFlorders(filter: { fromDate: string, toDate: string });

  protected abstract createFlorderFromTemplate(templateId: string, date: string);
}

import { Component } from '@angular/core';
import { go } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { RelocationSandbox } from 'app/core/sandboxes/relocation.sandbox';
import { Definitions } from 'app/core/store/definitions/definitions.interface';
import { CalendarPageContainer } from 'app/modules/calendar/calendar-page-container/calendar-page.container';
import { DragulaService } from 'ng2-dragula';
import { fadeInAnimation } from '../../../animations';
import { AzureMonitoringService } from '../../../core/services/AzureMonitoringService';
import * as fromRoot from '../../../core/store';
import * as relocationDetailActions from '../../../core/store/relocation-detail/relocation-detail.actions';
import * as calendarActions from '../../../core/store/calendar/calendar.actions';
import * as templateActions from '../../../core/store/template/template.actions';
import { CalendarDay, FlorderInfo } from '../../../core/store/calendar/calendar.interface';

@Component({
  selector: 'app-relocations-calendar-page',
  templateUrl: './relocations-calendar-page.container.html',
  styleUrls: ['./calendar-page.container.less'],
  animations: [fadeInAnimation],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelocationsCalendarPageContainer extends CalendarPageContainer {

  constructor(
    store: Store<fromRoot.RootState>,
    azureMonitoringService: AzureMonitoringService,
    dragulaService: DragulaService,
    private sandbox: RelocationSandbox
  ) {
    super(store, azureMonitoringService, dragulaService);

    this.store.dispatch(new relocationDetailActions.RelocationDetailClear());

    store.select('definitions').takeWhile(() => !this.destroyed).subscribe((definitions: Definitions) => {
      this.places = definitions.places.reduce((res, place) => {
        return {
          ...res,
          [place.id]: place
        };
      }, {});
    });
  }

  loadFlorders(dates: { fromDate: string, toDate: string }) {

    this.filter = {
      unloadingDateFrom: dates.fromDate,
      unloadingDateTo: dates.toDate,
    };
    this.store.dispatch(new calendarActions.CalendarRelocationsLoadAction({filter: this.filter, definitions: this.definitions, places: this.places}));
  }

  showFlorderModal(day: CalendarDay) {
    this.store.dispatch(new calendarActions.ShowCreateRelocationModalAction({
      day,
      templates: this.templates.templates,
      filter: this.filter,
      definitions: this.definitions,
      places: this.places
    }));
  }

  createFlorder() {
    this.store.dispatch(go(['/relocations/new']));
  }

  openFlorder(relocation: FlorderInfo) {
    this.store.dispatch(go([`relocations/${relocation.etmOrderNumber}`, { salesOrderNumber: relocation.salesOrderNumber, back: 'calendar/relocation' }]));
  }

  createTemplate() {
    this.store.dispatch(go(['/relocations/template/new', { back: 'relocations' }]));
  }

  protected createFlorderFromTemplate(templateId: string, date: string) {
    this.sandbox.createRelocationFromTemplate(templateId, date);
  }

  deleteTemplate(templateId: number) {
    this.store.dispatch(new templateActions.TemplatesDeleteAction({ templateId, type: 'RELOCATION' }));
  }

  requestDeliveryDates() {
    if (this.selectedTemplate) {
      this.store.dispatch(new calendarActions.CalendarRequestRelocationUnloadingDatesAction());
    }
  }

  selectTemplate(template) {
    this.store.dispatch(new calendarActions.CalendarTemplateSelectedAction(template));

    // request delivery dates for selected template when it is selected
    // not when it is unselected
    if (this.selectedTemplate) {
      this.requestDeliveryDates();
    }
  }

  editTemplate(templateId: number) {
    this.store.dispatch(new templateActions.TemplatesStartEditAction({ templateId, type: 'RELOCATION' }));
  }
}

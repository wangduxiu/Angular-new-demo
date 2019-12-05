import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AzureMonitoringService } from '../../../core/services/AzureMonitoringService';
import * as fromRoot from '../../../core/store';
import { BaseContainer } from '../../base/BaseContainer';
import { fadeInAnimation } from '../../../animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from '../../../core/services/validator.service';
import { InvitationDates } from '../../../core/store/admin/invitation-dates/invitation-dates.interface';
import * as actions from '../../../core/store/admin/invitation-dates/invitation-dates.actions';

@Component({
  selector: 'admin-invitation-dates-container',
  templateUrl: './invitation-dates-container.html',
  styleUrls: ['./invitation-dates-container.less'],
  animations: [fadeInAnimation],
})
export class InvitationDatesContainer extends BaseContainer {

  nextEpsUserInviteDate: String;
  nextClientUserInviteDate: String;
  busy = false;
  datesForm: FormGroup;

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService, private formBuilder: FormBuilder, private validatorService: ValidatorService) {
    super(store, azureMonitoringService);
    store.select('admin')
      .takeWhile(() => !this.destroyed)
      .map((admin: { dates: InvitationDates }) => admin && admin.dates)
      .subscribe(dates => {
        this.busy = dates.clientUserInvitationDate.loading || dates.clientUserInvitationDate.saving || dates.epsUserInvitationDate.loading || dates.epsUserInvitationDate.saving;
        this.nextClientUserInviteDate = dates.clientUserInvitationDate.date;
        this.nextEpsUserInviteDate = dates.epsUserInvitationDate.date;
      });
  }

  ngOnInit() {
    this.createForm();
  }

  ngOnChanges() {
    this.createForm();
  }

  private createForm() {
    const controlsConfig = {
      nextEpsUserInviteDate: [this.nextEpsUserInviteDate, [Validators.required, this.validatorService.datePatternValidator]],
      nextClientUserInviteDate: [this.nextClientUserInviteDate, [Validators.required, this.validatorService.datePatternValidator]],
    };
    this.datesForm = this.formBuilder.group(controlsConfig);
  }

  save() {
    this.store.dispatch(new actions.AdminInvitationDatesSaveClientAction(this.datesForm.value.nextClientUserInviteDate));
    this.store.dispatch(new actions.AdminInvitationDatesSaveEpsAction(this.datesForm.value.nextEpsUserInviteDate));
  }

}

import { Component } from '@angular/core';
import { BaseContainer } from '../../../base/BaseContainer';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../core/store';
import { AzureMonitoringService } from '../../../../core/services/AzureMonitoringService';
import * as actions from '../../../../core/store/service/service.actions';
import { Service } from '../../../../core/store/service/service.interface';
import { fadeInAnimation } from '../../../../animations';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.container.html',
  styleUrls: ['./contact-page.container.less'],
  animations: [fadeInAnimation],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageContainer extends BaseContainer {

  isSaving: boolean = false;

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService) {
    super(store, azureMonitoringService);

    store.select('service').takeWhile(() => !this.destroyed).subscribe((service: Service) => {
      this.isSaving = service.contact.saving;
    });
  }

  sendForm({ value }) {
    this.store.dispatch(new actions.ContactSendMessageAction({ message: value }));
  }
}

import { Component } from '@angular/core';
import { BaseContainer } from '../../../base/BaseContainer';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../core/store';
import { AzureMonitoringService } from '../../../../core/services/AzureMonitoringService';
import * as actions from '../../../../core/store/email-actors/email-actors.actions';
import { EmailActors, EmailActorsItem } from '../../../../core/store/email-actors/email-actors.interface';
import { fadeInAnimation } from '../../../../animations';

@Component({
  selector: 'app-email-actors-page',
  templateUrl: './email-actors-page.container.html',
  styleUrls: ['./email-actors-page.container.less'],
  animations: [fadeInAnimation],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailActorsPageContainer extends BaseContainer {

  emailActors: EmailActors;
  isLoading: boolean = false;
  isSaving: boolean = false;

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService) {
    super(store, azureMonitoringService);

    store.select('emailActors').takeWhile(() => !this.destroyed).subscribe((emailActors: EmailActors) => {
      this.emailActors = emailActors;
      this.isLoading = emailActors.loading;
      this.isSaving = emailActors.saving;
    });
  }

  createOrUpdateEmailActor({ value }) {
    this.store.dispatch(new actions.EmailActorsCreateOrUpdateAction({ emailActor: value }));
  }

  deleteEmailActor(emailActorId: number) {
    this.store.dispatch(new actions.EmailActorsDeleteAction({ id: emailActorId }));
  }

  deactivateEmailActor(emailActor: EmailActorsItem) {
    emailActor = Object.assign({}, emailActor, {
      isActive: !emailActor.isActive,
    });
    this.store.dispatch(new actions.EmailActorsCreateOrUpdateAction({ emailActor }));
  }
}

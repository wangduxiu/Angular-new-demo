import { Injectable } from '@angular/core';
import { go } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AbstractSandbox } from 'app/core/sandboxes/abstract.sandbox';
import { Observable } from 'rxjs/Observable';
import { AzureMonitoringService } from '../services/AzureMonitoringService';
import { TutorialRestService } from '../services/rest/tutorial.rest.service';
import * as fromRoot from '../store';
import { Config } from '../store/config/config.interface';

@Injectable()
export class TutorialSandbox extends AbstractSandbox {
  public tutorialUrl$: Observable<string> = this.store
    .select('config')
    .take(1)
    .map((config: Config) => {
      return config.tutorialUrl;
    });
  constructor(
    store: Store<fromRoot.RootState>,
    translateService: TranslateService,
    azureMonitoringService: AzureMonitoringService,
    private tutorialRestService: TutorialRestService
  ) {
    super(store, translateService, azureMonitoringService);
  }

  goToTutorials() {
    this.store.dispatch(go([`tutorials`]));
  }

  hideTutorial() {
    // save into backend to hide the tutorialpopup for ever
    return this.tutorialRestService.hideTutorial();
  }
}

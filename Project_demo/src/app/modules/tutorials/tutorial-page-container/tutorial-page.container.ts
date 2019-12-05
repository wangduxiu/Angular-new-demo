import { Component, OnInit } from '@angular/core';
import { go } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { TutorialSandbox } from 'app/core/sandboxes/tutorial.sandbox';
import { EmbedVideoService } from 'ngx-embed-video';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from '../../../core/store/';
import * as userContextActions from '../../../core/store/user-context/user-context.actions';

@Component({
  selector: 'app-tutorial-page-container',
  templateUrl: './tutorial-page.container.html',
  styleUrls: ['./tutorial-page.container.less'],
})
export class TutorialPageContainer implements OnInit {
  tutorials: any[] = [];
  tutorial: any = null;
  nextTutorialTitle = 'Next';
  prevTutorialTitle = 'Prev';
  tutorialUrl$: Observable<any> = this.tutorialSandbox.tutorialUrl$;
  tutorialUrl: string;
  finishedTutorials: any = JSON.parse(localStorage.getItem('finshedTutorials')) || {};
  status: any = { first: true, last: false };

  private titles = {
    invoices: 'my_europool_invoces',
    handshake: 'my_europool_flow_handshake',
    faq: 'my_europool_faq',
    'e-invoices': 'my_europool_einvoices',
    templates: 'my_europool_create_template',
    orders: 'my_europool_create_order',
    flows: 'my_europool_create_flow',
    calendar: 'my_europool_calendar',
  };

  constructor(
    private store: Store<fromRoot.RootState>,
    private translate: TranslateService,
    private embedService: EmbedVideoService,
    private tutorialSandbox: TutorialSandbox,
  ) { }

  ngOnInit() {
    this.tutorialUrl$.subscribe((url: string) => {
      this.tutorialUrl = url;
      this.loadTutorials();
    });
  }

  /**
   * Load the tutorial
   */
  toggleTutorial = (tutorial: any) => {
    this.tutorials.map((tutorialItem: any, index: number) => {
      if (tutorialItem.active) tutorialItem.active = false;
      if (tutorialItem.index === tutorial.index) {
        tutorialItem.active = true;
        this.status = { ...this.status, first: index === 0, last: index === this.tutorials.length - 1 };
      }
    });

    this.tutorial = tutorial;

    this.nextTutorialTitle = this.tutorials[this.nextIndex()].title;
    this.prevTutorialTitle = this.tutorials[this.prevIndex()].title;
  };

  /**
   * show the next tutorial and set current tutorial on complete
   */
  nextTutorial = () => {
    this.tutorials.map((tutorialItem: any) => {
      if (tutorialItem.index === this.tutorial.index) {
        tutorialItem.finished = true;
        this.finishedTutorials = { ...this.finishedTutorials, [this.tutorial.index]: tutorialItem.finished };
        localStorage.setItem('finshedTutorials', JSON.stringify(this.finishedTutorials));
      }
    });
    this.toggleTutorial(this.tutorials[this.nextIndex()]);
  };

  /***
   * Send request to hide tutorial popup & redirect to dashboard
   */
  finishTutorial = () => {
    // set last tutorial on finished
    const lastTutorial = this.tutorials[this.tutorials.length - 1];
    lastTutorial.finished = true;
    this.finishedTutorials = { ...this.finishedTutorials, [this.tutorial.index]: lastTutorial.finished };
    localStorage.setItem('finshedTutorials', JSON.stringify(this.finishedTutorials));

    // send request to hide tutorial popup & redirect to dashboard
    this.tutorialSandbox.hideTutorial().subscribe((response) => {
      if (response.status === 200) {
        this.store.dispatch(new userContextActions.UserContextUpdateTutorialAction());
        this.store.dispatch(go(['/dashboard']));
      }
    });
  }

  /**
   * gets the next tutorial index
   */
  private nextIndex() {
    let nextIndex = 0;

    // get current tutorial index
    const index = this.tutorials.findIndex((t: any) => t.index === this.tutorial.index);

    if (
      this.tutorials.length > 1 &&
      this.tutorials.length - 1 !== index
    ) {
      nextIndex = index + 1;
    }
    // set status of tutorials (needed in the tutorial menu comp)
    this.status = { ...this.status, first: index === 0, last: index === this.tutorials.length - 1 };

    return nextIndex;
  }

  /**
   * show the previous tutorial
   */
  prevTutorial = () => {
    this.toggleTutorial(this.tutorials[this.prevIndex()]);
  };

  /**
   * gets the prev tutorial index
   */
  private prevIndex() {
    let prevIndex = this.tutorials.length - 1;

    // get current tutorial index
    const index = this.tutorials.findIndex((t: any) => t.index === this.tutorial.index);
    if (this.tutorials.length > 1 && index !== 0) {
      prevIndex = index - 1;
    }

    return prevIndex;
  }

  /**
   * Load all the tutorials out of the translation file
   *
   * Concept of using the translations file as sole source for defining which video is shown in which language is unfortunately abandoned when this was implemented
   * Now, which video and in which order is defined by the private property 'titles'
   * and there is no way to show other video's for other languages.
   * That feature however will not be a big change (just add the language code in the directory)
   *
   * Furthermore, video ID is not used, so can be removed.
   *
   * I think that the customer has to deliver the video's to delaware and then we upload them to the server with the correct name and the right directory.
   *
   * proposal for change:
   * - add videoLanguage to translations.  That way, default is 'en' and can be overridden per language
   * - add a PDF link + button name to the translations.  Hosted on that server too.
   *
   */
  private loadTutorials() {
    let firstTutorial = null;
    this.translate.get('TUTORIALS.TUTORIALS_LOOP').subscribe((translationBlock: any) => {
      this.tutorials = Object.keys(translationBlock)
      .filter(key => key.startsWith('TITLE'))
      .filter((tutorialKey: string) => {
        const index = tutorialKey.split('_')[1];
        return !!this.translate.instant('TUTORIALS.TUTORIALS_LOOP.LOCATION_' + index);
      })
      .map((tutorialKey: string) => {
        const index = parseInt(tutorialKey.substring(6), 10);
        const endpoint = this.translate.instant('TUTORIALS.TUTORIALS_LOOP.LOCATION_' + index);
        
        const tutorialObject = {
          index: index - 1,
          title: translationBlock[tutorialKey],
          url: `${this.tutorialUrl}${endpoint}${!endpoint.endsWith('.mp4') ? '/movie' : ''}`,
          text: translationBlock['TEXT_' + index],
          video: translationBlock['VIDEO_ID_' + index], // TODO remove
          active: false,
          finished: !!this.finishedTutorials[index - 1]
        };
        // set's the first tutorial in variable
        if (firstTutorial === null) {
          tutorialObject.active = true;
          firstTutorial = tutorialObject;
        }

        return tutorialObject;
      });

      if (firstTutorial) {
        // toggles the firstTutorial
        this.toggleTutorial(firstTutorial);
      }
    });
  }
}


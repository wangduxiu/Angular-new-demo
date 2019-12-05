import { Component, OnInit } from '@angular/core';
import { BaseContainer } from '../../../base/BaseContainer';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../core/store';
import { AzureMonitoringService } from '../../../../core/services/AzureMonitoringService';
import { fadeInAnimation } from '../../../../animations';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-faq-page',
  templateUrl: './faq-page.container.html',
  styleUrls: ['./faq-page.container.less'],
  animations: [fadeInAnimation],
})
export class FAQPageContainer extends BaseContainer implements OnInit {

  topics;
  openQuestionId: number;

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService, private translate: TranslateService) {
    super(store, azureMonitoringService);
  }

  ngOnInit() {
    this.loadSections();
  }

  /**
   * Loads the sections from the translation file.  It's dynamic, so the end customer can add or remove questions, even make different questions for different languages
   * For compatibility reasons, the old structure of translations is kept and in this code, a workaround is implemented (sectionOrder, filtering out of 'TITLE','SUBTITLE','QUESTIONS_ABOUT'
   */
  private loadSections() {
    let translationBlock = this.translate.instant("SERVICE.FAQ");
    const sectionOrder = ['ORDERS', 'CUSTOMER_ACCOUNT', 'PRODUCTS', 'FLOWS', 'INVOICING'];
    const sections = Object.keys(translationBlock)
      .filter(key => ['TITLE', 'SUBTITLE', 'QUESTIONS_ABOUT'].indexOf(key) < 0)
      .map(key => {
        let index = sectionOrder.indexOf(key);
        if (index < 0) {
          index = sectionOrder.length;
          sectionOrder.push(key);
        }
        return {
          index,
          key,
          ...translationBlock[key]
        }
      })
      .sort((s1, s2) => s1.index - s2.index);
    let id = 0;
    this.topics = sections.map(section => {
      return {
        title: section.TITLE,
        questions: Object.keys(section).filter(key => key.startsWith('QUESTION')).map(questionKey => {
          const index = parseInt(questionKey.substring(9));
          id++;
          return {
            id,
            question: section[questionKey],
            answer: section['ANSWER_' + index]
          }
        })
      }
    });
  }

  openQuestion(id) {
    if (this.openQuestionId == id) {
      this.openQuestionId = null;
    } else {
      this.openQuestionId = id;
    }
  }
}

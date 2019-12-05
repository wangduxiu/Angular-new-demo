import { Component, OnInit } from '@angular/core';
import { go } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { logger } from 'app/core/util/logger';
import { fadeInAnimation } from '../../../../animations';
import { AzureMonitoringService } from '../../../../core/services/AzureMonitoringService';
import * as fromRoot from '../../../../core/store';
import * as actions from '../../../../core/store/admin/i18n/i18n.actions';
import { Definition } from '../../../../core/store/definitions/definition.interface';
import { util } from '../../../../core/util/util';
import { BaseContainer } from '../../../base/BaseContainer';

interface Comparison {
  missingKeys: string[],
  unknownKeys: string[]
}

@Component({
  selector: 'admin-i18n',
  templateUrl: './i18n.container.html',
  styleUrls: ['./i18n.container.less'],
  animations: [fadeInAnimation],
})
export class I18nContainer extends BaseContainer implements OnInit {

  json: string = null;
  csv: string = null;
  referenceJson: any = null;
  edit: boolean = false;
  languages: Definition[] = [];
  usedLanguage: string;
  errorMessage: string;
  saving: boolean;
  loading: boolean;

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService, private translate: TranslateService) {
    super(store, azureMonitoringService);
  }

  ngOnInit(): void {
    this.store.takeWhile(() => !this.destroyed).subscribe(store => {
      this.languages = store.admin.adminDefinitions.language;
      this.usedLanguage = store.session.userContext.language;
      this.referenceJson = store.i18n.referenceJson;
      this.saving = store.i18n.saving;
      this.loading = store.i18n.loading;

      if (store.i18n.json) {
        const json = this.insertMissingKeys(util.flattenJson(store.i18n.json), util.flattenJson(store.i18n.referenceJson));
        this.json = JSON.stringify(json, null, 2);
        this.csv = null;
      }
      if (store.i18n.allCsv) {
        this.csv = store.i18n.allCsv;
        this.json = null;
      }
    });
  }

  private insertMissingKeys(target: any, reference: any): any {
    const comp = this.compareFlattenedJsons(target, reference);
    const result = { ...target };
    comp.missingKeys.forEach(key => result[key] = 'XxX-TRANSLATION_MISSING-XxX');
    return result;
  }

  private compareFlattenedJsons(json: any, reference: any): Comparison {
    const refKeys = Object.keys(reference);
    const keys = Object.keys(json);
    const missingKeys = refKeys.filter(key => keys.indexOf(key) == -1);
    const unknownKeys = keys.filter(key => refKeys.indexOf(key) == -1);
    return { missingKeys, unknownKeys };
  }

  validate(jsonString: string): void {
    this.errorMessage = '';
    try {
      const o = JSON.parse(jsonString);
      const json = util.flattenJson(o);
      const ref = util.flattenJson(this.referenceJson);
      const { missingKeys, unknownKeys } = this.compareFlattenedJsons(json, ref);

      if (missingKeys.length) {
        this.errorMessage += `Missing keys: ${missingKeys.concat(', ')}<br>`;
      }
      if (unknownKeys.length) {
        this.errorMessage += `Unknown keys: ${unknownKeys.concat(', ')}<br>`;
      }
    } catch (e) {
      logger.error(e);
      this.errorMessage = 'Invalid json: ' + e;
    }
  }

  save(jsonOrCsv: string): void {
    if (this.csv) {
      this.store.dispatch(new actions.LanguageSaveAllAction(jsonOrCsv));
    } else {
      this.validate(jsonOrCsv);
      if (this.errorMessage === '') {
        const jsonToSave = util.unflattenJson(JSON.parse(jsonOrCsv));
        this.store.dispatch(new actions.LanguageSaveAction({ language: this.usedLanguage, json: jsonToSave }));
      }
    }
  }

  load(): void {
  }

  editLanguage(language: string) {
    this.store.dispatch(new actions.LanguageLoadAction({ language }));
  }

  editAllCsv() {
    this.store.dispatch(new actions.LanguageLoadAllAction());
  }

  testLanguage(language: string) {
    this.translate.use(language);
  }

  getTranslations(): string {
    const loadedTranslations = this.translate.store.translations;
    const flattened = util.flattenJson(loadedTranslations);
    return JSON.stringify(flattened, null, 2);
  }

  resetLanguages() {
    this.store.dispatch(go('/admin/i18n/reset'));
  }
}

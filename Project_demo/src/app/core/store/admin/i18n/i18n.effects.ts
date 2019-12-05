import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { logger } from 'app/core/util/logger';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../../../app.settings';
import { AdalService } from '../../../services/adal/adal.service';
import { AdminDefinitionRestService } from '../../../services/rest/admin/admin-definition.rest.service';
import { I18nRestService } from '../../../services/rest/i18n.rest.service';
import { util } from '../../../util/util';
import { RootState } from '../../index';
import * as actions from './i18n.actions';
import { LanguageLoadAllAction } from './i18n.actions';

@Injectable()
export class I18nEffects {

  private checkedInLanguages: string[] = ['bg', 'cs', 'da', 'de', 'el', 'en', 'es', 'fr', 'hu', 'it', 'nl', 'pl', 'pt', 'ro', 'sk', 'tr', 'uk'];

  constructor(private store: Store<RootState>, private actions$: Actions, private adminDefinitionRestService: AdminDefinitionRestService, private adalService: AdalService, private i18nRestService: I18nRestService) {
  }

  @Effect({dispatch: false})
  resetLanguageJsons$: Observable<Action> = this.actions$
    .ofType(actions.LANGUAGE_RESET_SERVER)
    .filter(action => this.adalService.isAuthenticated)
    .switchMap(action => {
      this.checkedInLanguages.forEach(lang => {
        const checkedIn$ = this.i18nRestService.getCheckedInTranslations(lang)
          .subscribe(translations => {
            if (translations) {
              this.i18nRestService.saveOrUpdateTranslations(lang, util.unflattenJson(translations)).subscribe(() => {
              });
            }
          });
      });
      // Get all languages, check if in DB

      return Observable.of(null);
    })

  @Effect({dispatch: false})
  setLanguageJsons$: Observable<Action> = this.actions$
    .ofType(actions.LANGUAGE_SET_MISSING_SERVER)
    .filter(action => this.adalService.isAuthenticated)
    .switchMap(action => {
      this.checkedInLanguages.forEach(lang => {
        const checkedIn$ = this.i18nRestService.getCheckedInTranslations(lang);
        const server$ = this.i18nRestService.getServerTranslations(lang);
        Observable.forkJoin(checkedIn$, server$).subscribe(results => {
          const checkedInVersion = results[0];
          const serverVersion = results[1];
          if (!serverVersion && checkedInVersion) {
            this.i18nRestService.saveOrUpdateTranslations(lang, util.unflattenJson(checkedInVersion)).subscribe(() => {
            });
          }
        })
      });
      // Get all languages, check if in DB

      return Observable.of(null);
    })

  @Effect({dispatch: false})
  setReferenceLanguageJsons$: Observable<Action> = this.actions$
    .ofType(actions.LANGUAGE_SET_REFERENCE_LANGUAGE)
    .startWith(new actions.LanguageSetReferenceLanguageAction())
    .filter(action => this.adalService.isAuthenticated)
    .switchMap(action => {
      const checkedIn$ = this.i18nRestService.getCheckedInTranslations(AppSettings.DEFAULT_LANGUAGE).subscribe(translations =>
        this.store.dispatch(new actions.LanguageSetReferenceLanguageSuccessAction({json: translations}))
      );
      return Observable.of(null);
    })

  @Effect()
  loadLanguageJson$: Observable<Action> = this.actions$
    .ofType(actions.LANGUAGE_LOAD)
    .filter(action => this.adalService.isAuthenticated)
    .switchMap(action =>                                                   // Register to this event, unregister previous if new event occurs.
      this.i18nRestService.getServerTranslations(action.payload.language)
        .map(translations => new actions.LanguageLoadSuccessAction(translations))
        .catch((err) => {
          return Observable.of(new actions.LanguageLoadFailAction(err));
        }),
    );

  @Effect()
  saveLanguageJson$: Observable<Action> = this.actions$
    .ofType(actions.LANGUAGE_SAVE)
    .filter(action => this.adalService.isAuthenticated)
    .withLatestFrom(this.store, (action, state) => {
      return {language: action.payload.language, json: action.payload.json, multisave: state.i18n.multisave};
    })
    .switchMap(({language, json, multisave}) =>                                                   // Register to this event, unregister previous if new event occurs.
      this.i18nRestService.saveOrUpdateTranslations(language, json)
        .map(translations => {
          if (multisave) {
            return new actions.LanguageSaveAllSuccessAction()
          } else {
            return new actions.LanguageSaveSuccessAction()
          }
        })
        .catch((err) => {
          return Observable.of(new actions.LanguageSaveFailAction(err));
        }),
    );

  @Effect()
  loadLanguagesJson$: Observable<Action> = this.actions$
    .ofType(actions.LANGUAGE_LOAD_ALL)
    .filter(action => this.adalService.isAuthenticated)
    .switchMap(action =>                                                   // Register to this event, unregister previous if new event occurs.
      this.i18nRestService.getServerTranslations(this.checkedInLanguages)
        .map(translations => new actions.LanguageLoadAllSuccessAction({
          translations,
          languages: this.checkedInLanguages
        }))
        .catch((err) => {
          return Observable.of(new actions.LanguageLoadAllFailAction(err));
        }),
    );

  /**
   *
   * This effect will save the csv input as jsons in the database.  Only languages in the header are saved.
   * Keys that are not known (not in CSV) are added and already known values from DB are used
   * So it's possible to uplaod a subset of translations (subset of keys or subset of languages)
   * @type {Observable<any>}
   */
  @Effect({dispatch: false})
  saveAllLanguagesJson$: Observable<Action> = this.actions$
    .ofType(actions.LANGUAGE_SAVE_ALL)
    .filter(action => this.adalService.isAuthenticated)
    .withLatestFrom(this.store, (action, state) => {
      return {csv: action.payload, allJson: state.i18n.allJson};
    })
    .switchMap(({csv, allJson}) => {
      // CSV to json for each language
      const rows = csv.split('\n');
      let header = rows.splice(0, 1)[0];
      const languages = header.split('\t');
      languages.splice(0, 1)[0];
      const translations = languages.reduce((result, language) => {
        return {
          ...result,
          [language]: {}
        }
      }, {});

      for (const row of rows) {
        const cols = row.split('\t');
        const key = cols.splice(0, 1)[0];
        if (key) {
          for (let i = 0; i < languages.length; i++) {
            const lang = languages[i];
            translations[lang][key] = cols[i];
          }
        }
      }

      // Add missing keys from original one (if loaded)
      languages.forEach(language => {
        allJson[language] && Object.keys(allJson[language]).forEach(key => {
          if (!translations[language][key]) {
            translations[language][key] = allJson[language][key];
          }
        });
      });
      Object.keys(translations).forEach(language => {
        if (language !== 'default') {
          this.removeEmptyTranslations(language, translations[language], allJson['default']);
          translations[language] = util.unflattenJson(translations[language]);
          this.store.dispatch(new actions.LanguageSaveAction({language, json: translations[language]}));
        }
      });
      logger.debug(translations);
      return Observable.of(null);
    });

  @Effect()
  saveAllLanguagesSuccessJson$: Observable<Action> = this.actions$
    .ofType(actions.LANGUAGE_SAVE_ALL_SUCCESS)
    .filter(action => this.adalService.isAuthenticated)
    .switchMap(() => {
      return Observable.of(new LanguageLoadAllAction())
    });

  removeEmptyTranslations(language, translation, defaultTranslation) {
    const keys = Object.keys(translation);
    keys.forEach(key => {
      if ((!translation[key] || translation[key].trim() == '') && (defaultTranslation[key] && defaultTranslation[key].trim() !== '')) {
        delete translation[key];
      }
    });
    const newKeys = Object.keys(translation);
    logger.debug(`language ${language}, old: ${keys.length}, new: ${newKeys.length}`)
  }
}

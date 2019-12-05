import * as actions from './i18n.actions';
import { initialState } from './i18n.model';
import { I18n } from "./i18n.interface";
import { util } from "../../../util/util";

export function reducer(state = initialState, action: actions.Actions): I18n {

  switch (action.type) {
    case actions.LANGUAGE_SET_REFERENCE_LANGUAGE_SUCCESS:
      return {
        ...state,
        referenceJson: action.payload.json
      };

    case actions.LANGUAGE_LOAD:
      return {
        ...state,
        loading: true,
        loaded: false,
      };
    case actions.LANGUAGE_LOAD_SUCCESS:

      return Object.assign({}, state, {
        loaded: true,
        loading: false,
        json: action.payload,
        allCsv: null
      });
    case actions.LANGUAGE_LOAD_FAIL:
      return state;

      /*
      Translations of all known languages are stored in the store.
      The referendce json (from assets/locale/en.json) is used to add missing keys in the store.
       */
    case actions.LANGUAGE_LOAD_ALL:
      return {
        ...state,
        loading: true,
      };
    case actions.LANGUAGE_LOAD_ALL_SUCCESS:
      const languages = ['default', ...action.payload.languages];
      const translations = [state.referenceJson, ...action.payload.translations];
      const flattenedJsons = {};
      let flattenedReferenceJson = util.flattenJson(state.referenceJson);
      const result = {
        languages,
        keys: Object.keys(flattenedReferenceJson),
        translations: Object.keys(flattenedReferenceJson).reduce((res, key) => { return {...res, [key]:[]}},{})
      };
      result.keys.sort();
      result.languages.forEach((lang, index) => {
        const flattened = util.flattenJson(translations[index]);
        flattenedJsons[lang] = flattened;
        result.keys.forEach(key => {
          result.translations[key][index] = flattened[key] || '';
        })
      });

      let allCsv = 'Name\t' + result.languages.join('\t') + '\n';

      result.keys.forEach(key => {
        allCsv += key + '\t' + result.translations[key].join('\t') + '\n';
      });

      return Object.assign({}, state, {
        loaded: true,
        loading: false,
        json: null,
        allJson: flattenedJsons,
        allCsv
      });
    case actions.LANGUAGE_LOAD_ALL_FAIL:
      return state;

    case actions.LANGUAGE_SAVE:
      return {
        ...state,
        saving: true,
        saved: false,
      };
    case actions.LANGUAGE_SAVE_ALL:
      return {
        ...state,
        saving: true,
        saved: false,
        multisave: true,
      };
    case actions.LANGUAGE_SAVE_ALL_SUCCESS:
      return {
        ...state,
        saving: false,
        saved: true,
        multisave: false,
      };
    case actions.LANGUAGE_SAVE_SUCCESS:

      return Object.assign({}, state, {
        saved: true,
        saving: false,
      });
    case actions.LANGUAGE_SAVE_FAIL:
      return state;

    default:
      return state;

  }

}

import * as settings from './settings.actions';
import { tassign } from 'tassign';
import { environment } from '../../../../environments/environment';
import { Settings } from '@app/core/interfaces/settings.interface';

/**
 * Initiële state voor settings
 */
export const SETTINGS_INITIAL_STATE: Settings = {
  selectedLanguage: null,
  selectedCulture: null,
  availableLanguages: environment.localisation.languages,
  isOnline: null
};

/**
 * case functies
 */
function setLanguage(state: Settings, action: settings.SetLanguage): Settings {
  return tassign(state, { selectedLanguage: action.payload });
}

function setCulture(state: Settings, action: settings.SetCulture): Settings {
  return tassign(state, { selectedCulture: action.payload });
}

function setOnline(state: Settings, action: settings.SetOnline): Settings {
  return tassign(state, { isOnline: action.payload });
}

/**
 * SettingReducer
 *
 * @param {Settings} state De state die aangepast zal worden door de getriggerde acties.
 * @param {actions.Actions} actie De actie zie de state zal aanpassen.
 */
export function reducer(
  state: Settings = SETTINGS_INITIAL_STATE,
  action: settings.Actions
): Settings {
  switch (action.type) {
    case settings.SET_LANGUAGE:
      return setLanguage(state, action);
    case settings.SET_CULTURE:
      return setCulture(state, action);
    case settings.SET_ONLINE:
      return setOnline(state, action);
  }

  return state;
}

/**
 * Selecters
 */
export const getSelectedLanguage = (state: Settings) => state.selectedLanguage;
export const getSelectedCulture = (state: Settings) => state.selectedCulture;
export const getAvailableLanguages = (state: Settings) =>
  state.availableLanguages;
export const getIsOnline = (state: Settings) => state.isOnline;

import * as actions from './config.actions';
import { initialConfig } from './config.model';
import { Config } from './config.interface';

export function reducer(state = initialConfig, action: actions.Actions): Config {

  switch (action.type) {
    case actions.CONFIG_GET: {
      return {
        ...state,
        ...action.payload,
        tutorialUrl: action.payload.TutorialUrl,
        instrumentationKey: action.payload.applicationInsightInstrumentationKey,
        verboseLogging: action.payload.VerboseLog,
        fetched: true
      };
    }

    default:
      return state;
  }
}

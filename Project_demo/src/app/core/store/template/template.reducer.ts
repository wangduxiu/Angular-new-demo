import { util } from '../../util/util';
import * as actions from './template.actions';
import { Actions } from './template.actions';
import { TemplateState } from './template.interface';
import { initialStateTemplate } from './template.model';

export function reducer(state = util.deepCopy(initialStateTemplate), action: Actions): TemplateState {

  switch (action.type) {
    case actions.ORDER_TEMPLATE_CREATE_START:
    case actions.RELOCATION_TEMPLATE_CREATE_START:
    case actions.ORDER_TEMPLATE_EDIT:
    case actions.RELOCATION_TEMPLATE_EDIT: {
      return Object.assign({}, state, {
        saving: false,
        saveSuccess: null,
        saved: null
      });
    }

    case actions.TEMPLATE_SAVE_FROM_ORDER: {
      return Object.assign({}, state, {
        saving: true,
        saveSuccess: false,
        saved: false
      });
    }

    case actions.TEMPLATE_SAVE_SUCCESS: {
      return Object.assign({}, state, {
        saving: false,
        saveSuccess: true,
        saved: true
      });
    }

    case actions.TEMPLATE_SAVE_FAIL: {
      return Object.assign({}, state, {
        saving: false,
        saveSuccess: false,
        saved: false
      });
    }

    case actions.TEMPLATES_LOAD: {
      return Object.assign({}, state, {
        loading: true,
      });
    }

    case actions.TEMPLATES_LOAD_SUCCESS: {
      return Object.assign({}, state, {
        loadSuccess: true,
        loading: false,
        templates: action.payload,
      });
    }

    case actions.TEMPLATES_LOAD_FAIL: {
      return Object.assign({}, state, {
        loadSuccess: false,
        loading: false,
        templates: [],
      });
    }

    case actions.TEMPLATES_DELETE: {
      return Object.assign({}, state, {
        deleting: true,
        deleted: false,
      });
    }

    case actions.TEMPLATES_DELETE_SUCCESS: {
      return Object.assign({}, state, {
        deleting: false,
        deleted: true,
        templates: state.templates.filter(item => item.id != action.payload.id),
      });
    }

    case actions.TEMPLATES_DELETE_FAIL: {
      return Object.assign({}, state, {
        deleting: false,
        deleted: false,
      });
    }

    case actions.TEMPLATES_START_EDIT: {
      return Object.assign({}, state, {
        editing: action.payload.templateId,
      });
    }

    case actions.TEMPLATES_START_EDIT_SUCCESS: {
      return Object.assign({}, state, {
        editing: null,
      });
    }

    case actions.TEMPLATES_START_EDIT_FAIL: {
      return Object.assign({}, state, {
        editing: null,
      });
    }

    default: {
      return state;
    }
  }
}

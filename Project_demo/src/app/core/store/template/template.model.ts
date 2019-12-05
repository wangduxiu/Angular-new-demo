import { initialStateFlorderDetail } from '../florder-detail/florder-detail.model';
import { TemplateState } from './template.interface';

export const initialStateTemplate: TemplateState =  {
  template: initialStateFlorderDetail,
  templates: [],
  loading: false,
  loadSuccess: false,
  saving: false,
  saveSuccess: false,
  saved: false,
  deleting: false,
  deleted: false,
  type: 'ORDER',
  editing: null
};

import { FlorderDetail } from '../florder-detail/florder-detail.interface';

export type TemplateType = 'ORDER' | 'RELOCATION';

export interface TemplateState  {
  loading: boolean;
  loadSuccess: boolean;
  saving: boolean;
  saveSuccess: boolean;
  saved: boolean;
  deleting: boolean;
  deleted: boolean;
  editing: number;
  type: TemplateType;
  template: FlorderDetail;
  templates: FlorderDetail[];
}

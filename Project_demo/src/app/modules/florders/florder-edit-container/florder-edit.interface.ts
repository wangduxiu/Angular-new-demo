export interface PanelStatus {
  isVisible: boolean;
  isEdit: boolean;
  isEditable: boolean;
  isNew: boolean;
  isUpdate: boolean;
  isView: boolean;
  busy: boolean;
  saving?: boolean;
  opening?: boolean;
  isFlowEdit?: boolean;
  isHandshaker?: boolean;
  createTemplate: boolean;
  editTemplate: boolean;
}

export interface NotebookBlockBaseProps {
  editStatus: NotebookBlockEditStatus;
  isFocused: boolean;
  onRequestEdit: () => void;
  onRequestStopEdit: () => void;
}

export enum NotebookBlockEditStatus {
  EDITING,
  EDITABLE,
  NOT_EDITABLE,
}

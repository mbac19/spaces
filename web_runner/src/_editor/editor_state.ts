export type EditorContent = Array<string>;

export interface EditorStateDef {
  initialContent?: EditorContent;
}

export interface EditorState {
  readonly element: HTMLElement;
}

export interface CursorRange {
  anchorLine: number;
  anchorCol: number;
  focusLine: number;
  focusCol: number;
}

export interface CursorCollapsed {
  focusLine: number;
  focusCol: number;
}

export type Cursor = CursorRange | CursorCollapsed;

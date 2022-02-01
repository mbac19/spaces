import "./notebook_block.css";

import classNames from "classnames";
import React, { useContext } from "react";
import { assertIsDefined } from "./error_utils";

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

const NotebookBlockContext = React.createContext<
  NotebookBlockBaseProps | undefined
>(undefined);

export interface NotebookBlockProps extends NotebookBlockBaseProps {
  classes?: {
    root?: string;
  };
  children: React.ReactNode;
}

export function NotebookBlock(props: NotebookBlockProps) {
  return (
    <NotebookBlockContext.Provider value={props}>
      <div
        className={classNames("NotebookBlock-Root", props.classes?.root)}
        tabIndex={0}
      >
        {props.children}
      </div>
    </NotebookBlockContext.Provider>
  );
}

export function NotebookBlockLeftGutter(props: { children?: React.ReactNode }) {
  return <div className="NotebookBlock-LeftGutter">{props.children}</div>;
}

export function NotebookBlockRightGutter(props: {
  children?: React.ReactNode;
}) {
  return <div className="NotebookBlock-RightGutter">{props.children}</div>;
}

export interface NotebookBlockMainContentProps {
  children?: React.ReactNode;
  onDoubleClick?: () => void;
  onClick?: () => void;
}

export function NotebookBlockMainContent(props: NotebookBlockMainContentProps) {
  const notebookCtx = useContext(NotebookBlockContext);

  assertIsDefined(
    notebookCtx,
    "NotebookMainContent must be used within a NobookBlock component"
  );

  return (
    <div
      className={classNames({
        "NotebookBlock-Content": true,
        "NotebookBlock-Content-Editable":
          notebookCtx.editStatus !== NotebookBlockEditStatus.NOT_EDITABLE,
      })}
      onClick={props.onClick}
      onDoubleClick={props.onDoubleClick}
    >
      {props.children}
    </div>
  );
}

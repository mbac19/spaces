import "./notebook_block.css";

import AceEditor from "react-ace";
import classNames from "classnames";

import { DocumentBlock } from "./fs_api/document";
import { NotebookBlockBaseProps } from "./notebook_block";
import { useState } from "react";

import "ace-builds/src-noconflict/mode-lisp";
import "ace-builds/src-noconflict/theme-github";

export interface NotebookBlockLevrProps extends NotebookBlockBaseProps {
  block: DocumentBlock;
}

export function NotebookBlockLevr(props: NotebookBlockLevrProps) {
  const [content, setContent] = useState<string>(props.block.content);

  const initialLineCount = content.split("\n").length;

  const [lineCount, setLineCount] = useState<number>(initialLineCount);

  function onBlurEditor() {
    props.onRequestStopEdit();
  }

  function onChangeEditor(content: string, session: { lines: Array<string> }) {
    const lineCount = content.split("\n").length;
    setContent(content);
    setLineCount(Math.max(lineCount, 1));
  }

  function onFocusEditor() {
    props.onRequestEdit();
  }

  return (
    <div
      className={classNames({
        "NotebookBlock-Root": true,
        "NotebookBlock-Levr": true,
      })}
    >
      <div className="NotebookBlock-LeftGutter"></div>
      <div className="NotebookBlock-Content">
        <div
          className={classNames({
            "NotebookBlock-CodeEditor": true,
            "NotebookBlock-CodeEditor-Focus": props.isFocused,
          })}
        >
          <AceEditor
            highlightActiveLine={false}
            mode="lisp"
            onBlur={onBlurEditor}
            onChange={onChangeEditor}
            onFocus={onFocusEditor}
            setOptions={{ maxLines: lineCount }}
            showGutter={false}
            showPrintMargin={false}
            tabSize={4}
            theme="github"
            value={content}
            width="100%"
          />
        </div>
      </div>
      <div className="NotebookBlock-RightGutter"></div>
    </div>
  );
}

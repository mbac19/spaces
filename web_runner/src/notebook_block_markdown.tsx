import "./notebook_block.css";

import AceEditor from "react-ace";
import classNames from "classnames";
import ReactMarkdown from "react-markdown";

import { DocumentBlockMarkdown } from "./fs_api";
import {
  NotebookBlockBaseProps,
  NotebookBlockEditStatus,
} from "./notebook_block";
import { useState } from "react";

import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-github";

export interface NotebookBlockMDProps extends NotebookBlockBaseProps {
  block: DocumentBlockMarkdown;
}

export function NotebookBlockMarkdown(props: NotebookBlockMDProps) {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const initialLineCount = props.block.content.split("\n").length;

  const [lineCount, setLineCount] = useState<number>(initialLineCount);

  const [content, setContent] = useState<string>(props.block.content);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  function onClickContent() {
    console.log("CLICK CONTENT");
  }

  function onDoubleClickContent() {
    setIsEditing(true);
    console.log("DOUBLE CLICK CONTENT");
  }

  function onChangeEditor(content: string) {
    const lineCount = content.split("\n").length;
    setContent(content);
    setLineCount(Math.max(lineCount, 1));
  }

  function onEval() {
    console.log("ON EVAL");
    setIsEditing(false);
  }

  return (
    <div
      className={classNames({
        "NotebookBlock-Root": true,
        "NotebookBlock-Markdown": true,
      })}
    >
      <div className="NotebookBlock-LeftGutter"></div>
      <div
        className={classNames({
          "NotebookBlock-Content": true,
          "NotebookBlock-Content-Editable":
            props.editStatus !== NotebookBlockEditStatus.NOT_EDITABLE,
        })}
        onDoubleClick={onDoubleClickContent}
        onClick={onClickContent}
      >
        <div
          className={classNames({
            "NotebookBlock-MarkdownEditor": true,
            "NotebookBlock-MarkdownEditor-Focus": isFocused || isEditing,
          })}
        >
          {!isEditing && <ReactMarkdown>{content}</ReactMarkdown>}

          {isEditing && (
            <AceEditor
              commands={[
                {
                  name: "eval",
                  bindKey: { win: "Shift-Enter", mac: "Shift-Enter" },
                  exec: onEval,
                },
              ]}
              focus={true}
              highlightActiveLine={false}
              mode="markdown"
              onChange={onChangeEditor}
              setOptions={{ maxLines: lineCount }}
              showGutter={false}
              showPrintMargin={false}
              tabSize={4}
              theme="github"
              value={content}
              width="100%"
            />
          )}
        </div>
      </div>
      <div className="NotebookBlock-RightGutter"></div>
    </div>
  );
}

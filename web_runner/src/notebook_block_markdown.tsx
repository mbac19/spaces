import "./notebook_block_markdown.css";

import AceEditor from "react-ace";
import classNames from "classnames";
import ReactMarkdown from "react-markdown";

import { DocumentBlockMarkdown } from "./fs_api";
import {
  NotebookBlock,
  NotebookBlockLeftGutter,
  NotebookBlockMainContent,
  NotebookBlockRightGutter,
} from "./notebook_block";
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

  function onClickContent() {}

  function onDoubleClickContent() {
    setIsEditing(true);
  }

  function onChangeEditor(content: string) {
    const lineCount = content.split("\n").length;
    setContent(content);
    setLineCount(Math.max(lineCount, 1));
  }

  function onEval() {
    setIsEditing(false);
  }

  return (
    <NotebookBlock classes={{ root: "NotebookBlockMarkdown-Root" }} {...props}>
      <NotebookBlockLeftGutter />
      <NotebookBlockMainContent
        onClick={onClickContent}
        onDoubleClick={onDoubleClickContent}
      >
        <div
          className={classNames({
            "NotebookBlockMarkdown-Editor": true,
            "NotebookBlockMarkdown-Editor-Focus": isFocused || isEditing,
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
      </NotebookBlockMainContent>
      <NotebookBlockRightGutter />
    </NotebookBlock>
  );
}

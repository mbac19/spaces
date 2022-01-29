import "./notebook.css";

import { Document, DocumentBlock, DocumentBlockType } from "./fs_api/document";
import {
  NotebookBlockBaseProps,
  NotebookBlockEditStatus,
} from "./notebook_block";
import { NotebookBlockLevr } from "./notebook_block_levr";
import { NotebookBlockMarkdown } from "./notebook_block_markdown";

export interface NotebookProps {
  document: Document;
}

export function Notebook(props: NotebookProps) {
  return (
    <div className="Notebook-Root">
      <div className="Notebook-BlockList">
        {props.document.blocks.map((block, i) => (
          <div className="Notebook-BlockContainer" key={block.id}>
            <GetBlock
              block={block}
              isFocused={false}
              editStatus={NotebookBlockEditStatus.EDITABLE}
              onRequestEdit={() => {}}
              onRequestStopEdit={() => {}}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function GetBlock(props: { block: DocumentBlock } & NotebookBlockBaseProps) {
  switch (props.block.type) {
    case DocumentBlockType.LEVR:
      return <NotebookBlockLevr {...props} block={props.block} />;

    case DocumentBlockType.MARKDOWN:
      return <NotebookBlockMarkdown {...props} block={props.block} />;
  }
}

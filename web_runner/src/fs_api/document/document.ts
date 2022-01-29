export interface Document {
  version: string;

  blocks: Array<DocumentBlock>;
}

export enum DocumentBlockType {
  LEVR = "LEVR",
  MARKDOWN = "MARKDOWN",
}

export type DocumentBlock = DocumentBlockLevr | DocumentBlockMarkdown;

export interface DocumentBlockLevr {
  type: DocumentBlockType.LEVR;
  id: string;
  content: string;
}

export interface DocumentBlockMarkdown {
  type: DocumentBlockType.MARKDOWN;
  id: string;
  content: string;
}

export type ASTNode = ASTNodeModule | ASTNodeNumber | ASTNodeString;

export enum ASTNodeType {
  LIST = "LIST",
  MODULE = "MODULE",
  NUMBER = "NUMBER",
  STRING = "STRING",
  SYSTEM_REF = "SYSTEM_REF",
}

export function List(value: Array<ASTNode>): ASTNodeList {
  return { type: ASTNodeType.LIST, value };
}

export function Number(value: number): ASTNodeNumber {
  return { type: ASTNodeType.NUMBER, value };
}

export function String(value: string): ASTNodeString {
  return { type: ASTNodeType.STRING, value };
}

export function SystemRef(symbol: string): ASTNodeSystemRef {
  return { type: ASTNodeType.SYSTEM_REF, symbol };
}

export interface ASTNodeList {
  type: ASTNodeType.LIST;
  value: Array<ASTNode>;
}

export interface ASTNodeSystemRef {
  type: ASTNodeType.SYSTEM_REF;
  symbol: string;
}

export interface ASTNodeModule {
  type: ASTNodeType.MODULE;
  module: { [symbol: string]: ASTNode };
}

export interface ASTNodeNumber {
  type: ASTNodeType.NUMBER;
  value: number;
}

export interface ASTNodeString {
  type: ASTNodeType.STRING;
  value: string;
}

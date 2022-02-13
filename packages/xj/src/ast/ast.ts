export type ASTNode =
  | ASTNodeBoolean
  | ASTNodeCall
  | ASTNodeDefine
  | ASTNodeEfrl
  | ASTNodeEfrm
  | ASTNodeKey
  | ASTNodeModule
  | ASTNodeNumber
  | ASTNodeString
  | ASTNodeSymbol
  | ASTNodeSystemRef;

export type ASTNodeCallable = ASTNodeSystemRef;

export enum ASTNodeType {
  BOOLEAN = "BOOLEAN",
  CALL = "CALL",
  DEFINE = "DEFINE",
  EFRL = "ERL",
  EFRM = "ERM",
  KEY = "KEY",
  MODULE = "MODULE",
  NUMBER = "NUMBER",
  STRING = "STRING",
  SYMBOL = "SYMBOL",
  SYSTEM_REF = "SYSTEM_REF",
}

export interface ASTNodeBoolean {
  type: ASTNodeType.BOOLEAN;
  value: boolean;
}

export interface ASTNodeCall {
  type: ASTNodeType.CALL;
  callable: ASTNode;
  params: Array<ASTNode>;
}

export interface ASTNodeDefine {
  type: ASTNodeType.DEFINE;
  symbol: string;
  value: ASTNode;
}

export interface ASTNodeEfrl {
  type: ASTNodeType.EFRL;
  form: Array<ASTNode>;
}

export interface ASTNodeEfrm {
  type: ASTNodeType.EFRM;
  form: Array<ASTNode>;
}

export interface ASTNodeKey {
  type: ASTNodeType.KEY;
  key: string;
}

export interface ASTNodeModule {
  type: ASTNodeType.MODULE;
  scope: { [symbol: string]: ASTNode };
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

export interface ASTNodeSymbol {
  type: ASTNodeType.SYMBOL;
  value: string;
}

export interface ASTNodeSystemRef {
  type: ASTNodeType.SYSTEM_REF;
  symbol: string;
}

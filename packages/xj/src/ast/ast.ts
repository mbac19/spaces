export type ASTNode =
  | ASTNodeBoolean
  | ASTNodeCall
  | ASTNodeDefine
  | ASTNodeEfrl
  | ASTNodeEfrm
  | ASTNodeKey
  | ASTNodeLambda
  | ASTNodeModule
  | ASTNodeNumber
  | ASTNodeString
  | ASTNodeSymbol
  | ASTNodeSystemRef
  | ASTNodeVoid;

export type Key = string;

export type ASTNodeCallable = ASTNodeLambda | ASTNodeSystemRef;

export enum ASTNodeType {
  BOOLEAN = "BOOLEAN",
  CALL = "CALL",
  DEFINE = "DEFINE",
  EFRL = "ERL",
  EFRM = "ERM",
  KEY = "KEY",
  LAMBDA = "LAMBDA",
  MODULE = "MODULE",
  NUMBER = "NUMBER",
  PARAM = "PARAM",
  STRING = "STRING",
  SYMBOL = "SYMBOL",
  SYSTEM_REF = "SYSTEM_REF",
  VOID = "VOID",
}

export interface ASTNodeBoolean {
  type: ASTNodeType.BOOLEAN;
  value: boolean;
}

export interface ASTNodeCall {
  type: ASTNodeType.CALL;
  callable: ASTNodeCallable;
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
  value: Array<ASTNode>;
}

export interface ASTNodeKey {
  type: ASTNodeType.KEY;
  key: string;
}

export interface ASTNodeLambda {
  type: ASTNodeType.LAMBDA;
  body: Array<ASTNode>;
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

export interface ASTNodeParam {
  type: ASTNodeType.PARAM;
  ref: number | Key;
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

export interface ASTNodeVoid {
  type: ASTNodeType.VOID;
}

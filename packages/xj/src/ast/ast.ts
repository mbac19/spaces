import { IContext } from "../context";
import { Interpreter } from "../interpreter";

export type ASTNode =
  | ASTNodeBoolean
  | ASTNodeCall
  | ASTNodeDefine
  | ASTNodeEfrl
  | ASTNodeEfrm
  | ASTNodeExport
  | ASTNodeFatalError
  | ASTNodeImport
  | ASTNodeKey
  | ASTNodeLambda
  | ASTNodeLogicalAnd
  | ASTNodeLogicalNot
  | ASTNodeLogicalOr
  | ASTNodeModule
  | ASTNodeNumber
  | ASTNodeParam
  | ASTNodeString
  | ASTNodeSymbol
  | ASTNodeSystemCallable
  | ASTNodeVoid;

export type Key = string;

export type ASTNodeCallable = ASTNodeLambda | ASTNodeSystemCallable;

export type ASTNodeReference = ASTNodeParam | ASTNodeSymbol;

export type SystemCall = (evaluator: {}) => ASTNode;

export enum ASTNodeType {
  BOOLEAN = "BOOLEAN",
  CALL = "CALL",
  COND = "COND",
  DEFINE = "DEFINE",
  EFRL = "EFRL",
  EFRM = "EFRM",
  EXPORT = "EXPORT",
  FATAL_ERROR = "FATAL_ERROR",
  IMPORT = "IMPORT",
  LOGICAL_AND = "LOGICAL_AND",
  LOGICAL_OR = "LOGICAL_OR",
  LOGICAL_NOT = "LOGICAL_NOT",
  KEY = "KEY",
  LAMBDA = "LAMBDA",
  MODULE = "MODULE",
  NUMBER = "NUMBER",
  PARAM = "PARAM",
  STRING = "STRING",
  SYMBOL = "SYMBOL",
  SYSTEM_CALLABLE = "SYSTEM_CALLABLE",
  VOID = "VOID",
}

export const CALLABLE_TYPES: Array<ASTNodeType> = [
  ASTNodeType.LAMBDA,
  ASTNodeType.SYSTEM_CALLABLE,
];

export interface ASTNodeBoolean {
  type: ASTNodeType.BOOLEAN;
  value: boolean;
}

export interface ASTNodeCall {
  type: ASTNodeType.CALL;
  callable: ASTNodeCallable | ASTNodeReference;
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

export interface ASTNodeExport {
  type: ASTNodeType.EXPORT;
  symbol: string;
  value: ASTNode;
}

export interface ASTNodeFatalError {
  type: ASTNodeType.FATAL_ERROR;
  message: string | undefined;
}

export interface ASTNodeImport {
  type: ASTNodeType.IMPORT;
  symbol: string;
}

export interface ASTNodeKey {
  type: ASTNodeType.KEY;
  key: string;
}

export interface ASTNodeLambda {
  type: ASTNodeType.LAMBDA;
  body: Array<ASTNode>;
}

export interface ASTNodeLogicalAnd {
  type: ASTNodeType.LOGICAL_AND;
  value: Array<ASTNode>;
}

export interface ASTNodeLogicalOr {
  type: ASTNodeType.LOGICAL_OR;
  value: Array<ASTNode>;
}

export interface ASTNodeLogicalNot {
  type: ASTNodeType.LOGICAL_NOT;
  value: ASTNode;
}

export interface ASTNodeModule {
  type: ASTNodeType.MODULE;
  exports: { [symbol: string]: ASTNode };
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

export interface ASTNodeSystemCallable {
  type: ASTNodeType.SYSTEM_CALLABLE;

  call: (
    context: IContext,
    interpreter: Interpreter,
    ...params: Array<ASTNode>
  ) => ASTNode;
}

export interface ASTNodeVoid {
  type: ASTNodeType.VOID;
}

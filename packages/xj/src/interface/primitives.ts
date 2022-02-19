import {
  ASTNode,
  ASTNodeBoolean,
  ASTNodeCall,
  ASTNodeCallable,
  ASTNodeDefine,
  ASTNodeEfrl,
  ASTNodeEfrm,
  ASTNodeExport,
  ASTNodeFatalError,
  ASTNodeImport,
  ASTNodeLambda,
  ASTNodeLogicalAnd,
  ASTNodeLogicalNot,
  ASTNodeLogicalOr,
  ASTNodeMatch,
  ASTNodeModule,
  ASTNodeNumber,
  ASTNodeParam,
  ASTNodeReference,
  ASTNodeString,
  ASTNodeSymbol,
  ASTNodeType,
  ASTNodeVoid,
} from "../ast";
import { Scope } from "../context";

export function And<T extends AtLeastTwo<ASTNode>>(
  ...value: T
): ASTNodeLogicalAnd {
  return { type: ASTNodeType.LOGICAL_AND, value };
}

export function Boolean(value: boolean): ASTNodeBoolean {
  return { type: ASTNodeType.BOOLEAN, value };
}

export function Call(
  callable: ASTNodeCallable | ASTNodeReference,
  ...params: Array<ASTNode>
): ASTNodeCall {
  return { type: ASTNodeType.CALL, callable, params };
}

export function Define(symbol: string, value: ASTNode): ASTNodeDefine {
  return { type: ASTNodeType.DEFINE, symbol, value };
}

export function Efrl(...form: Array<ASTNode>): ASTNodeEfrl {
  return { type: ASTNodeType.EFRL, form };
}

export function Efrm(...form: Array<ASTNode>): ASTNodeEfrm {
  return { type: ASTNodeType.EFRM, form };
}

export function Export(symbol: string, value: ASTNode): ASTNodeExport {
  return { type: ASTNodeType.EXPORT, symbol, value };
}

export function FatalError(message?: string): ASTNodeFatalError {
  return { type: ASTNodeType.FATAL_ERROR, message };
}

export function Import(symbol: string): ASTNodeImport {
  return { type: ASTNodeType.IMPORT, symbol };
}

export function Lambda(...body: Array<ASTNode>): ASTNodeLambda {
  return { type: ASTNodeType.LAMBDA, body };
}

export function Not(value: ASTNode): ASTNodeLogicalNot {
  return { type: ASTNodeType.LOGICAL_NOT, value };
}

export function Number(value: number): ASTNodeNumber {
  return { type: ASTNodeType.NUMBER, value };
}

export function Or<T extends AtLeastTwo<ASTNode>>(
  ...value: T
): ASTNodeLogicalOr {
  return { type: ASTNodeType.LOGICAL_OR, value };
}

export function Param(ref: number | string): ASTNodeParam {
  return { type: ASTNodeType.PARAM, ref };
}

export function Match(
  ...matchers: AtLeastOne<[ASTNode, ASTNode]>
): ASTNodeMatch {
  return { type: ASTNodeType.MATCH, matchers };
}

export function Module(exports: Scope): ASTNodeModule {
  return { type: ASTNodeType.MODULE, exports };
}

export function String(value: string): ASTNodeString {
  return { type: ASTNodeType.STRING, value };
}

export function Symb(value: string): ASTNodeSymbol {
  return { type: ASTNodeType.SYMBOL, value };
}

export function Void(): ASTNodeVoid {
  return { type: ASTNodeType.VOID };
}

type AtLeastOne<T> = [T, ...Array<T>];

type AtLeastTwo<T> = [T, T, ...Array<T>];

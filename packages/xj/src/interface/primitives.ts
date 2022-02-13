import {
  ASTNode,
  ASTNodeBoolean,
  ASTNodeCall,
  ASTNodeCallable,
  ASTNodeDefine,
  ASTNodeEfrl,
  ASTNodeEfrm,
  ASTNodeExport,
  ASTNodeLambda,
  ASTNodeLogicalAnd,
  ASTNodeLogicalNot,
  ASTNodeLogicalOr,
  ASTNodeModule,
  ASTNodeNumber,
  ASTNodeParam,
  ASTNodeReference,
  ASTNodeString,
  ASTNodeSymbol,
  ASTNodeSystemRef,
  ASTNodeType,
  ASTNodeVoid,
} from "../ast";
import { Scope } from "../context";

export function And<T extends AtLeastTwoNodes>(...value: T): ASTNodeLogicalAnd {
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

export function Lambda(...body: Array<ASTNode>): ASTNodeLambda {
  return { type: ASTNodeType.LAMBDA, body };
}

export function Not(value: ASTNode): ASTNodeLogicalNot {
  return { type: ASTNodeType.LOGICAL_NOT, value };
}

export function Number(value: number): ASTNodeNumber {
  return { type: ASTNodeType.NUMBER, value };
}

export function Or<T extends AtLeastTwoNodes>(...value: T): ASTNodeLogicalOr {
  return { type: ASTNodeType.LOGICAL_OR, value };
}

export function Param(ref: number | string): ASTNodeParam {
  return { type: ASTNodeType.PARAM, ref };
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

export function SystemRef(symbol: string): ASTNodeSystemRef {
  return { type: ASTNodeType.SYSTEM_REF, symbol };
}

export function Void(): ASTNodeVoid {
  return { type: ASTNodeType.VOID };
}

type AtLeastTwoNodes = [ASTNode, ASTNode, ...Array<ASTNode>];

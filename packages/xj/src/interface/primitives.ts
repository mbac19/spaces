import {
  ASTNode,
  ASTNodeBoolean,
  ASTNodeCall,
  ASTNodeCallable,
  ASTNodeDefine,
  ASTNodeEfrl,
  ASTNodeNumber,
  ASTNodeString,
  ASTNodeSymbol,
  ASTNodeSystemRef,
  ASTNodeType,
} from "../ast";

export function Boolean(value: boolean): ASTNodeBoolean {
  return { type: ASTNodeType.BOOLEAN, value };
}

export function Call(
  callable: ASTNodeCallable,
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

export function Number(value: number): ASTNodeNumber {
  return { type: ASTNodeType.NUMBER, value };
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
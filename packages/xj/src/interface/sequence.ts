import { ASTNode } from "../ast";
import { Call, Import, Number } from "./primitives";

export function Range(a: number, b?: number): ASTNode {
  const params = b === undefined ? [Number(a)] : [Number(a), Number(b)];

  return Call(Import("std.range"), ...params);
}

export function First(node: ASTNode): ASTNode {
  return Call(Import("std.first"), node);
}
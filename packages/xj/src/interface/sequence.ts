import { ASTNode, ASTNodeReference } from "../ast";
import { Call, Import, Number } from "./primitives";
import { SequenceNode } from "../lib_std/ast";

export function Count(node: ASTNode): ASTNode {
  return Call(Import("std.count"), node);
}

export function First(node: ASTNode): ASTNode {
  return Call(Import("std.first"), node);
}

export function In(node: ASTNode, seq: ASTNode) {
  return Call(Import("std.in"), node, seq);
}

export function Range(a: number, b?: number): ASTNode {
  const params = b === undefined ? [Number(a)] : [Number(a), Number(b)];
  return Call(Import("std.range"), ...params);
}

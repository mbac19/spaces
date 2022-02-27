import { ASTNode } from "../ast";
import { Call, Import } from "./primitives";

export function Equals(a: ASTNode, b: ASTNode): ASTNode {
  return Call(Import("std.equals"), a, b);
}

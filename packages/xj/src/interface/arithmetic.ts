import { ASTNode } from "../ast";
import { AtLeastTwo } from "./_utils";
import { Call, Import } from "./primitives";

export function Add(...params: AtLeastTwo<ASTNode>): ASTNode {
  return Call(Import("std.add"), ...params);
}

export function List(...params: Array<ASTNode>): ASTNode {
  return Call(Import("std.list"), ...params);
}

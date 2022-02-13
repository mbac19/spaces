import { Add as AddLib } from "../lib_std/add";
import { ASTNode } from "../ast";
import { Call, SystemRef } from "./primitives";

export function Add(...params: Array<ASTNode>): ASTNode {
  return Call(SystemRef(AddLib.symbol), ...params);
}

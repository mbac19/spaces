import { ASTNode } from "../ast";
import { AtLeastTwo } from "./_utils";
import { Call, Define, Efrl, Import, Symb } from "./primitives";

export function Add(...params: AtLeastTwo<ASTNode>): ASTNode {
  return Efrl(Define("add", Import("std.add")), Call(Symb("add"), ...params));
}

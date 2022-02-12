import { ASTNode } from "../ast/ast";
import { LibCallable } from "../lib";

export const Add: LibCallable = {
  isCallable: true,

  name: "add",

  call(...params: Array<ASTNode>): ASTNode {
    throw Error("NYI");
  },
};

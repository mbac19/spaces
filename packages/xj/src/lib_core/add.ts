import { ASTNode } from "../ast/ast";
import { Context } from "../context";
import { Interpreter } from "../interpreter";
import { LibCallable } from "../lib";
import { NAMESPACE } from "./constants";

export const Add: LibCallable<Array<ASTNode>, ASTNode> = {
  symbol: `${NAMESPACE}.add`,

  call(
    context: Context,
    interpreter: Interpreter,
    ...params: Array<ASTNode>
  ): ASTNode {
    throw Error("NYI");
  },
};

import { ASTNode } from "../ast";
import { IContext } from "../context";

export interface Interpreter {
  eval(context: IContext, node: ASTNode): ASTNode;

  evalCall(
    context: IContext,
    callable: ASTNode,
    params: Array<ASTNode>
  ): ASTNode;
}

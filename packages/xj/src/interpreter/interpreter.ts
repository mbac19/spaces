import { ASTNode } from "../ast";
import { Context } from "../context";

export interface Interpreter {
  eval(context: Context, node: ASTNode): ASTNode;
}

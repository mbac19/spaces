import { ASTNode } from "../ast";

export interface Interpreter {
  eval(node: ASTNode): ASTNode;
}

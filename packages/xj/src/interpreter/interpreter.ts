import { AST } from "../ast";

export interface Interpreter {
  eval(node: AST): AST;
}

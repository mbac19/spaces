import { AST } from "../ast";
import { Interpreter } from "./interpreter";

export class STDInterpreter implements Interpreter {
  public eval(node: AST): AST {
    throw Error("NYI");
  }
}

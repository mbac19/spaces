import { ASTNode } from "../ast";
import { injectable } from "inversify";
import { Interpreter } from "./interpreter";

@injectable()
export class STDInterpreter implements Interpreter {
  public eval(node: ASTNode): ASTNode {
    throw Error("NYI");
  }
}

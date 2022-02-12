import { ASTNode } from "../ast";
import { injectable } from "inversify";
import { Parser } from "./parser";

@injectable()
export class JSONParser implements Parser<ASTNode> {
  public parse(source: ASTNode): ASTNode {
    return source;
  }
}

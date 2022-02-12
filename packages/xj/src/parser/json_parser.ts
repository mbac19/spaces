import { AST } from "../ast";
import { Parser } from "./parser";

export class JSONParser implements Parser<AST> {
  public parse(source: Object): AST {
    return source;
  }
}

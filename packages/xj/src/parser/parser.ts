import { AST } from "../ast";

export interface Parser<Source> {
  parse(source: Source): AST;
}

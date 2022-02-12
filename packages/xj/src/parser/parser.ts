import { ASTNode } from "../ast";

export interface Parser<Source> {
  parse(source: Source): ASTNode;
}

import { ASTNode } from "../ast";

export interface ModuleSystem {
  search(symbol: string): ASTNode;
}

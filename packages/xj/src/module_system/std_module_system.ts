import * as Types from "../types";

import { ASTNode, isModuleNode } from "../ast";
import { inject, injectable } from "inversify";
import { Libs } from "../libs";
import { ModuleSystem } from "./module_system";
import { ModuleNotFoundError } from "../errors";

@injectable()
export class STDModuleSystem implements ModuleSystem {
  constructor(@inject(Types.Libs) private readonly libs: Libs) {}

  public search(symbol: string): ASTNode {
    const tokens = symbol.split(".");

    let node: ASTNode = this.libs[tokens[0]];

    for (let i = 1; i < tokens.length; ++i) {
      if (!isModuleNode(node)) {
        throw new ModuleNotFoundError();
      }

      node = node.exports[tokens[i]];
    }

    if (node === undefined) {
      throw new ModuleNotFoundError();
    }

    return node;
  }
}

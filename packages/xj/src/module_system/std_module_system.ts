import * as Types from "../types";

import { ASTNode } from "../ast";
import { inject, injectable } from "inversify";
import { Libs } from "../libs";
import { ModuleSystem } from "./module_system";
import { ModuleNotFoundError } from "../errors";

@injectable()
export class STDModuleSystem implements ModuleSystem {
  constructor(@inject(Types.Libs) private readonly libs: Libs) {}

  public search(symbol: string): ASTNode {
    const node = this.libs[symbol];
    if (node === undefined) {
      throw new ModuleNotFoundError();
    }
    return node;
  }
}

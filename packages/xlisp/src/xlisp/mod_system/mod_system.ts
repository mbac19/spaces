import fs from "fs";
import path from "path";

import { IModSystem, ModuleSearchDef } from "../../mod_system";
import { injectable } from "inversify";
import { ModCachePolicy } from "./mod_system_cache";
import { ModSystemNeverCache } from ".";
import { Source } from "../source";

@injectable()
export class ModSystem implements IModSystem<Source> {
  private readonly cache: Record<string, Source> = {};

  private readonly cachePolicy: ModCachePolicy;

  private readonly searchPaths: Array<string>;

  constructor() {
    this.cachePolicy = ModSystemNeverCache;
    this.searchPaths = [];
  }

  /**
   * Loads the source code at a particular module.
   */
  public getModuleSource(atPath: string): Source {
    const buffer = fs.readFileSync(atPath);
    const source = new Source(buffer.toString());
    return source;
  }

  /**
   * Returns the path to the module if one is found. Otherwise,
   * returns undefined.
   */
  public findModule(search: ModuleSearchDef): string | undefined {
    const possiblePaths = this.createPossibleModulePaths(search);

    for (const possiblePath of possiblePaths) {
      if (!fs.existsSync(possiblePath)) {
        continue;
      }

      const stat = fs.statSync(possiblePath);

      if (stat.isDirectory()) {
        throw Error(
          `Expecting module to be file. Found dir at key: ${search.targetKey}`
        );
      }

      return possiblePath;
    }
  }

  private createPossibleModulePaths(search: ModuleSearchDef): Array<string> {
    const possiblePaths = [];

    const searchTokens = search.targetKey.split(".");

    const modName = searchTokens[searchTokens.length - 1];

    let isRelativeSearch = false;

    if (searchTokens[0] === "") {
      isRelativeSearch = true;
      searchTokens.shift();
    }

    // STEP 1 - Search locally for the designated module.

    // TODO: Relative Path is wrong. Needs to be appendable.
    let relativePath = ".";

    for (const token of searchTokens.slice(0, -1)) {
      if (token === "") {
        relativePath += "/..";
      } else {
        relativePath += `/${token}`;
      }
    }

    const resolvedRelativePath = path.resolve(search.fromPath, relativePath);

    possiblePaths.push(
      path.resolve(resolvedRelativePath, `${modName}.el`),
      path.resolve(resolvedRelativePath, modName, "index.el")
    );

    // TODO: Not yet supporting search paths.

    return possiblePaths;
  }
}

import { IModSystem, ModuleSearchDef } from "../mod_system";
import { Source } from "./source";

export class ModSystem implements IModSystem<Source> {
  public findModule(search: ModuleSearchDef): string | undefined {
    throw Error("NOT YET IMPLEMENTED");
  }

  public getModuleSource(atPath: string): Source {
    throw Error("NOT YET IMPLEMENTED");
  }
}

import "reflect-metadata";

import * as Types from "./types";

import { ASTNode, ASTNodeModule } from "./ast";
import { Container } from "inversify";
import { Interpreter } from "./interpreter";
import { JSONParser, Parser } from "./parser";
import { Libs } from "./libs";
import { std } from "./lib_std";
import { STDInterpreter } from "./interpreter";
import { ModuleSystem } from "./module_system/module_system";
import { STDModuleSystem } from "./module_system/std_module_system";

export function performBind(container: Container) {
  container.bind<Libs>(Types.Libs).toDynamicValue(() => ({ std }));
  container.bind<ModuleSystem>(Types.ModuleSystem).to(STDModuleSystem);
  container.bind<Interpreter>(Types.Interpreter).to(STDInterpreter);
  container.bind<Parser<ASTNode>>(Types.Parser).to(JSONParser);
}

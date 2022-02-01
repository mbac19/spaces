import * as Types from "./types";

import { Container } from "inversify";
import { IModSystem } from "./mod_system";
import { Interpreter } from "./interpreter";
import { IParser } from "./parser";
import { lib as libCore, makeNodes } from "../lib_core";
import { MakeNodes, ModuleNode } from "./node";
import {
  ModSystem as XlispModSystem,
  Parser as XlispParser,
  Source as XlispSource,
} from "./xlisp";

/**
 *
 */
export function xlispBindings(container: Container) {
  container.bind<Array<ModuleNode>>(Types.Libs).toDynamicValue(() => [libCore]);

  container.bind<MakeNodes>(Types.MakeNodes).toDynamicValue(() => makeNodes);

  container.bind<IParser<XlispSource>>(Types.Parser).to(XlispParser);

  container.bind<IModSystem<XlispSource>>(Types.ModSystem).to(XlispModSystem);

  container.bind<Interpreter>(Types.Interpreter).to(Interpreter);
}

/**
 *
 */
export function jsonBindings(container: Container) {
  container.bind<Array<ModuleNode>>(Types.Libs).toDynamicValue(() => [libCore]);

  container.bind<Interpreter>(Types.Interpreter).to(Interpreter);

  throw Error("MISSING INJECTIONS");
}

import "reflect-metadata";

import * as Types from "./types";

import { ASTNode } from "./ast";
import { Container } from "inversify";
import { LibCore } from "./lib_core";
import { Interpreter } from "./interpreter";
import { JSONParser, Parser } from "./parser";
import { Lib } from "./lib";
import { STDInterpreter } from "./interpreter";

export function performBind(container: Container) {
  container.bind<[Lib]>(Types.Libs).toDynamicValue(() => [new LibCore()]);
  container.bind<Interpreter>(Types.Interpreter).to(STDInterpreter);
  container.bind<Parser<ASTNode>>(Types.Parser).to(JSONParser);
}

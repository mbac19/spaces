import "reflect-metadata";

import * as Types from "../src/types";

import minimist from "minimist";
import path from "path";

import { assert } from "@levr/error_utils";
import { Container } from "inversify";
import { Interpreter } from "../src/interpreter";
import { Logger } from "../lib_core";
import { ModSystem, Parser } from "../src/xlisp";
import { ModuleNode } from "../src/node";
import { xlispBindings } from "../src/inversify.config";

const ROOT = path.resolve(__dirname, "..");

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

async function main() {
  const container = new Container({ defaultScope: "Singleton" });

  xlispBindings(container);

  const argv = minimist(process.argv);

  const parseOnly = argv["parse-only"] ?? false;

  assert(argv._.length > 2, `exec must include a filename`);

  const fileName = argv._[argv._.length - 1];

  assert(typeof fileName === "string");

  const modSystem = container.get<ModSystem>(Types.ModSystem);

  const filePath = constructFilePath(fileName);

  const dirPath = path.dirname(filePath);

  const source = modSystem.getModuleSource(filePath);

  const parser = container.get<Parser>(Types.Parser);

  const ast = parser.parse(source);

  if (parseOnly) {
    console.log(JSON.stringify(ast, null, 4));
    return;
  }

  const interpreter = container.get<Interpreter>(Types.Interpreter);

  const baseContext = interpreter.buildBaseContext();

  const pathToLibCore = argv["lib-core"]
    ? path.resolve(ROOT, argv["lib-core"])
    : undefined;

  for (const lib of getLibs(container, pathToLibCore)) {
    baseContext.mergeScope(lib.scope);
  }

  const result = interpreter.evalModule(ast, undefined, dirPath, baseContext);

  Logger.log(result);
}

function constructFilePath(fileName: string): string {
  if (fileName.endsWith(".el")) {
    return path.resolve(ROOT, fileName);
  }

  return path.resolve(ROOT, `${fileName}.el`);
}

function getLibs(
  container: Container,
  libCorePath?: string
): Array<ModuleNode> {
  const modSystem = container.get<ModSystem>(Types.ModSystem);

  const parser = container.get<Parser>(Types.Parser);

  const interpreter = container.get<Interpreter>(Types.Interpreter);

  const libs = container.get<Array<ModuleNode>>(Types.Libs);

  if (libCorePath === undefined) {
    return libs;
  }

  const source = modSystem.getModuleSource(libCorePath);

  const ast = parser.parse(source);

  const baseContext = interpreter.buildBaseContext();

  for (const lib of libs) {
    baseContext.mergeScope(lib.scope);
  }

  return libs.concat([
    interpreter.evalModule(ast, undefined, undefined, baseContext),
  ]);
}

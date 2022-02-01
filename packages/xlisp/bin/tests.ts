import "reflect-metadata";

import * as Types from "../src/types";

import chalk from "chalk";
import fs from "fs";
import minimist from "minimist";
import path from "path";

import { assert } from "@levr/error_utils";
import { Container } from "inversify";
import { ModSystem, Parser } from "../src/xlisp";
import { xlispBindings } from "../src/inversify.config";
import { Interpreter, ModuleNode } from "../src";

const ROOT = path.resolve(__dirname, "..");

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

async function main() {
  const container = new Container({ defaultScope: "Singleton" });

  xlispBindings(container);

  const argv = minimist(process.argv);

  assert(argv._.length > 2, "exec must include a dir name");

  const dirName = path.resolve(ROOT, argv._[argv._.length - 1]);

  const testDirName = path.resolve(dirName, "tests");

  const fileList = fs.readdirSync(testDirName);

  assert(typeof dirName === "string");

  const modSystem = container.get<ModSystem>(Types.ModSystem);

  const parser = container.get<Parser>(Types.Parser);

  const interpreter = container.get<Interpreter>(Types.Interpreter);

  const libs = getLibs(container, path.resolve(dirName, `lib_core.el`));

  let test = 1;

  let nextFilename = `${String(test).padStart(4, "0")}.el`;

  while (fileList.includes(nextFilename)) {
    const filePath = path.resolve(testDirName, nextFilename);

    const source = modSystem.getModuleSource(filePath);

    const ast = parser.parse(source);

    const baseContext = interpreter.buildBaseContext();

    for (const lib of libs) {
      baseContext.mergeScope(lib.scope);
    }

    try {
      interpreter.evalModule(ast, undefined, dirName, baseContext);
      console.log(chalk.green(`- Test ${test} passed`));
    } catch (error) {
      console.log(chalk.red(`- Test ${test} failed: ${String(error)}`));
    }

    test += 1;
    nextFilename = `${String(test).padStart(4, "0")}.el`;
  }
}

function getLibs(container: Container, libCorePath: string): Array<ModuleNode> {
  const modSystem = container.get<ModSystem>(Types.ModSystem);

  const parser = container.get<Parser>(Types.Parser);

  const interpreter = container.get<Interpreter>(Types.Interpreter);

  const libs = container.get<Array<ModuleNode>>(Types.Libs);

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

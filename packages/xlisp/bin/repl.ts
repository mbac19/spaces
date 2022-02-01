import * as readline from "readline";

import libCore from "../lib_core";

import { Interpreter, Parser } from "../src";

async function main() {
  const interpreter = new Interpreter({ libs: [libCore] });

  const parser = new Parser();

  const rl = readline.createInterface(process.stdin);

  process.stdout.write("> ");

  for await (const line of rl) {
    const program = parser.parse(line);

    const baseContext = interpreter.buildBaseContext();

    const result = interpreter.eval(program, baseContext);

    console.log(result);

    process.stdout.write("> ");
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

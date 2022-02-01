import { Logger } from "../logger";
import { makeCallableLibEntryNode } from "../../src";

export const error = makeCallableLibEntryNode(
  "error",
  (interpreter, context, ...args) => {
    if (args.length === 0) {
      throw Error("Error");
    }

    const evaled = args.map((n) => interpreter.eval(n, context));

    throw Error(Logger.serializeNodes(...evaled));
  }
);

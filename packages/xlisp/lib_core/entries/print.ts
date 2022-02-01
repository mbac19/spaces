import { Logger } from "../logger";
import { makeCallableLibEntryNode } from "../../src";
import { makeVoidNode } from "../make_nodes/void";

export const print = makeCallableLibEntryNode(
  "print",
  (interpreter, context, ...args) => {
    const evaled = args.map((x) => interpreter.eval(x, context));
    Logger.log(...evaled);
    return makeVoidNode();
  }
);

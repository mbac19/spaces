import {
  IncorrectArgsError,
  makeCallableLibEntryNode,
  Scope,
} from "../../../src";
import { makeModuleNode } from "../../make_nodes/module";
import { makeNumberNode } from "../../make_nodes/number";

export const pair = makeCallableLibEntryNode(
  "pair",
  (interpreter, context, ...args) => {
    if (args.length !== 2) {
      throw IncorrectArgsError.quantityMismatch({
        symbol: "pair",
        actual: args.length,
        expecting: 2,
      });
    }

    return makeModuleNode({
      __len: makeNumberNode(2),
      first: interpreter.eval(args[0], context),
      second: interpreter.eval(args[1], context),
    });
  }
);

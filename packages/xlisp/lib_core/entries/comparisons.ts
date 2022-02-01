import { IncorrectArgsError, makeCallableLibEntryNode } from "../../src";
import { isEqual, isSame } from "../equality_utils";

export const is = makeCallableLibEntryNode(
  "is",
  (interpreter, context, ...args) => {
    if (args.length !== 2) {
      throw IncorrectArgsError.quantityMismatch({
        symbol: "is",
        actual: args.length,
        expecting: 2,
      });
    }

    const n1 = interpreter.eval(args[0], context);

    const n2 = interpreter.eval(args[1], context);

    return isSame(n1, n2);
  }
);

export const isEq = makeCallableLibEntryNode(
  "eq",
  (interpreter, context, ...args) => {
    if (args.length !== 2) {
      throw IncorrectArgsError.quantityMismatch({
        symbol: "eq",
        actual: args.length,
        expecting: 2,
      });
    }

    const n1 = interpreter.eval(args[0], context);

    const n2 = interpreter.eval(args[1], context);

    return isEqual(n1, n2);
  }
);

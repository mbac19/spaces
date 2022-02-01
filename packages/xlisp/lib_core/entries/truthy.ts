import {
  assertIsBooleanNode,
  Context,
  IncorrectArgsError,
  Interpreter,
  isBooleanNode,
  makeCallableLibEntryNode,
  Node,
  TypeError,
} from "../../src";
import { isTruthy } from "../equality_utils";
import { makeBooleanNode } from "../make_nodes/boolean";
import { makeVoidNode } from "../make_nodes/void";

export const and = makeCallableLibEntryNode(
  "and",
  (interpreter, context, ...args) => {
    if (args.length < 2) {
      throw new IncorrectArgsError(
        "Expecting and operator to take at least 2 arguments"
      );
    }

    let lastEval: Node;

    for (const next of args) {
      lastEval = interpreter.eval(next, context);
      if (!isTruthy(lastEval)) {
        return lastEval;
      }
    }

    // @ts-ignore
    return lastEval;
  }
);

export const or = makeCallableLibEntryNode(
  "or",
  (interpreter, context, ...args) => {
    if (args.length < 2) {
      throw new IncorrectArgsError(
        "Expecting or operator to take at least 2 arguments"
      );
    }

    let lastEval: Node;

    for (const next of args) {
      lastEval = interpreter.eval(next, context);

      if (isTruthy(lastEval)) {
        return lastEval;
      }
    }

    // @ts-ignore
    return lastEval;
  }
);

export const not = makeCallableLibEntryNode(
  "not",
  (interpreter, context, ...args) => {
    if (args.length !== 1) {
      throw IncorrectArgsError.quantityMismatch({
        symbol: "not",
        actual: args.length,
        expecting: 1,
      });
    }

    const evaled = interpreter.eval(args[0], context);

    return makeBooleanNode(!isTruthy(evaled));
  }
);

export const $if = makeCallableLibEntryNode(
  "if",
  (interpreter, context, ...args) => {
    if (args.length !== 3 && args.length !== 2) {
      throw new IncorrectArgsError(
        "Expecting if statement to have 2 or 3 arguments"
      );
    }

    const [first, second, third] = args;

    const predicate = interpreter.eval(first, context);

    if (!isBooleanNode(predicate)) {
      throw new TypeError(`if predicate must return boolean type`);
    }

    return predicate.value
      ? interpreter.eval(second, context)
      : third !== undefined
      ? interpreter.eval(third, context)
      : makeVoidNode();
  }
);

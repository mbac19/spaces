import {
  assertIsIdentifierNode,
  getNodeScope,
  IncorrectArgsError,
  isIdentifierNode,
  isNumberNode,
  KeyError,
  makeCallableLibEntryNode,
  makeResolvableLibEntryNode,
  Node,
  NodeType,
  TypeError,
} from "../../src";
import { makeBooleanNode } from "../make_nodes/boolean";
import { makeNumberNode } from "../make_nodes/number";
import { makeVoidNode } from "../make_nodes/void";

export const imp = makeCallableLibEntryNode(
  "import",
  (interpreter, context, ...args) => {
    if (args.length !== 1) {
      throw IncorrectArgsError.quantityMismatch({
        actual: args.length,
        expecting: 1,
        symbol: "import",
      });
    }

    const first = args[0];
    assertIsIdentifierNode(first);

    return interpreter.import(context, first.value);
  }
);

export const exp = makeCallableLibEntryNode(
  "export",
  (interpreter, context, ...args) => {
    let lastSymbol: Node | undefined;

    // The export function takes a list of symbols that can be exported.
    for (const n of args) {
      const evaledNode = interpreter.eval(n, context);

      if (evaledNode.type !== NodeType.IDENTIFIER) {
        throw new IncorrectArgsError(`export requires all args to be symbols`);
      }

      const value = context.get(evaledNode.value);

      if (value === undefined) {
        throw Error(
          `Symbol ${value} not assigned to value, cannot be exported`
        );
      }

      context.setExposed(evaledNode.value, value);

      lastSymbol = evaledNode;
    }

    // Returns the last symbole being exposed or void if nothing is exposed.
    return lastSymbol ?? makeVoidNode();
  }
);

export const mod = makeCallableLibEntryNode(
  "mod",
  (interpreter, context, ...args) => {
    if (args.length < 1) {
      throw new IncorrectArgsError(`mod requires at least 1 parameter`);
    }

    const mod = interpreter.evalModule(args, undefined, undefined, context);

    return mod;
  }
);

export const fn = makeCallableLibEntryNode(
  "fn",
  (interpreter, context, ...args) => {
    return { type: NodeType.CALLABLE, value: args };
  }
);

export const param = makeCallableLibEntryNode(
  "param",
  (interpreter, context, ...args) => {
    if (args.length < 1) {
      throw new IncorrectArgsError(`param should have exactly 1 arg`);
    }

    const first = interpreter.eval(args[0], context);

    if (!isNumberNode(first)) {
      throw Error(`param takes 1 argument which is an integer`);
    }

    return context.getParamAtIndex(first.value);
  }
);

export const keyParam = makeCallableLibEntryNode(
  "key-param",
  (interpreter, context, ...args) => {
    if (args.length < 1) {
      throw new IncorrectArgsError(`param should have exactly 1 arg`);
    }

    const first = args[0];

    if (!isIdentifierNode(first)) {
      throw Error(`key-param takes 1 symbol`);
    }

    return context.getParamForKey(first.value);
  }
);

export const paramLen = makeResolvableLibEntryNode(
  "param-len",
  (_interpreter, context) => {
    return makeNumberNode(context.getParamsLength());
  }
);

export const get = makeCallableLibEntryNode(
  "get",
  (interpreter, context, ...args) => {
    if (args.length !== 2) {
      throw new IncorrectArgsError(
        `get requires 2 parameters. Actual: ${args.length}`
      );
    }

    const key = args[1];

    if (key.type !== NodeType.IDENTIFIER) {
      throw new TypeError(`get requires a symbol`);
    }

    const mod = interpreter.eval(args[0], context);

    const scope = getNodeScope(mod);

    if (scope === undefined) {
      throw Error("Cannot call get on a node that is not a module");
    }

    const value = scope[key.value];

    if (value === undefined) {
      throw new KeyError(`Cannot find value for key ${key.value}`);
    }

    return value;
  }
);

export const has = makeCallableLibEntryNode(
  "has",
  (interpreter, context, ...args) => {
    if (args.length !== 2) {
      throw new IncorrectArgsError(
        `has requires 2 parameters. Actual: ${args.length}`
      );
    }

    const key = args[1];

    if (key.type !== NodeType.IDENTIFIER) {
      throw new TypeError(`has requires a symbol`);
    }

    const mod = interpreter.eval(args[0], context);

    const scope = getNodeScope(mod);

    return makeBooleanNode(scope !== undefined && key.value in scope);
  }
);

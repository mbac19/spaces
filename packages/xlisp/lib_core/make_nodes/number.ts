import {
  assertIsNumberNode,
  IncorrectArgsError,
  makeCallableLibEntryNode,
  NodeType,
  NumberNode,
  Primitive,
  Scope,
} from "../../src";
import { lt } from "../comparison_utils";
import { minus, plus } from "../math_utils";

export const makeNumberNode = (value: number): NumberNode => {
  const node: NumberNode = {
    type: NodeType.PRIMITIVE,
    primitive: Primitive.NUMBER,
    value,
  };

  node.scope = makeNumberScope(node);

  return node;
};

const makeNumberScope = (node: NumberNode): Scope => ({
  "+": makeCallableLibEntryNode("+", (interpreter, context, ...args) => {
    const numberNodes = args.map((n) => {
      const evaled = interpreter.eval(n, context);
      assertIsNumberNode(evaled);
      return evaled;
    });

    return plus(node, ...numberNodes);
  }),

  "-": makeCallableLibEntryNode("-", (interpreter, context, ...args) => {
    const rhs = interpreter.eval(args[0], context);
    assertIsNumberNode(rhs);
    return minus(node, rhs);
  }),

  "<": makeCallableLibEntryNode("<", (interpreter, context, ...args) => {
    if (args.length !== 1) {
      throw IncorrectArgsError.quantityMismatch({
        symbol: "<",
        expecting: 1,
        actual: args.length,
      });
    }

    const next = interpreter.eval(args[0], context);

    assertIsNumberNode(next);

    return lt(node, next);
  }),
});

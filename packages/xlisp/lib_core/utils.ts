import {
  CallableNode,
  Context,
  ID,
  Interpreter,
  isNumberNode,
  Node,
  NodeType,
} from "../src";

export function evalToNumber(
  node: Node,
  interpreter: Interpreter,
  context: Context
): number {
  const evaled = interpreter.eval(node, context);

  if (!isNumberNode(evaled)) {
    throw new TypeError("Expecting node to have type number");
  }

  return evaled.value;
}

export function getNamespaceNode(node: Node, identifier: ID): Node | undefined {
  throw Error("NOT YET IMPLEMENTED");
}

export function callableNamespaceNode(
  node: Node,
  identifier: ID
): CallableNode | undefined {
  throw Error("NOT YET IMPLEMENTED");
}

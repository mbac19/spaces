import {
  BooleanNode,
  Context,
  Interpreter,
  Node,
  NodeType,
  Primitive,
} from "../src";
import { makeBooleanNode } from "./make_nodes/boolean";

export function isTruthy(a: Node): boolean {
  switch (a.type) {
    case NodeType.PRIMITIVE: {
      switch (a.primitive) {
        case Primitive.BOOLEAN:
          return a.value;

        case Primitive.NUMBER:
          // TODO: Not a number suppor?
          return a.value !== 0;

        case Primitive.STRING:
          return a.value !== "";

        case Primitive.VOID:
          return false;
      }
    }

    default:
      return true;
  }
}

export function isSame(a: Node, b: Node): BooleanNode {
  if (a === b) {
    return makeBooleanNode(true);
  }

  if (a.type !== b.type) {
    return makeBooleanNode(false);
  }

  if (a.type === NodeType.PRIMITIVE) {
    // @ts-ignore
    return makeBooleanNode(a.primitive === b.primitive && a.value === b.value);
  }

  return makeBooleanNode(shallowEqualObjects(a, b));
}

export function isEqual(a: Node, b: Node): BooleanNode {
  throw Error("NOT YET IMPLEMENTED");
}

type KVO = Record<string, any>;

function shallowEqualObjects(a: KVO, b: KVO) {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // TODO: Should make this more efficient.

  for (const key of keysA) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  for (const key of keysB) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}

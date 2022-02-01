import { makeNumberNode } from "./make_nodes/number";
import { NumberNode } from "../src";

export function plus(...nodes: Array<NumberNode>): NumberNode {
  return makeNumberNode(nodes.reduce((acc, n) => acc + n.value, 0));
}

export function times(...nodes: Array<NumberNode>): NumberNode {
  return makeNumberNode(nodes.reduce((acc, n) => acc * n.value, 1));
}

export function minus(n1: NumberNode, n2: NumberNode): NumberNode {
  return makeNumberNode(n1.value - n2.value);
}

export function divide(n1: NumberNode, n2: NumberNode): NumberNode {
  // TODO: Divide by 0?
  return makeNumberNode(n1.value / n2.value);
}

export function modulo(n1: NumberNode, n2: NumberNode): NumberNode {
  return makeNumberNode(n1.value % n2.value);
}

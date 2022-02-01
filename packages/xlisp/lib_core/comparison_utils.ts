import { BooleanNode, NumberNode } from "../src";
import { makeBooleanNode } from "./make_nodes/boolean";

export function lt(node1: NumberNode, node2: NumberNode): BooleanNode {
  return makeBooleanNode(node1.value < node2.value);
}

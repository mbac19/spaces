import {
  makeCallableLibEntryNode,
  Node,
  NodeType,
  QuoteNode,
  Scope,
} from "../../src";
import { makeNumberNode } from "./number";

export function makeQuoteNode(value: Array<Node>): QuoteNode {
  const node: QuoteNode = {
    type: NodeType.QUOTE,
    value,
  };

  node.scope = makeScope(value);

  return node;
}

function makeScope(value: Array<Node>): Scope {
  return {
    __len: makeCallableLibEntryNode("__len", () => {
      return makeNumberNode(value.length);
    }),
  };
}

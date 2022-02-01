import { KeyNode, NodeType } from "../../src";

export const makeKeyNode = (value: string): KeyNode => {
  return { type: NodeType.KEY, value };
};

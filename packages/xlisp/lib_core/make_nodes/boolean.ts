import { BooleanNode, NodeType, Primitive, Scope } from "../../src";

export const makeBooleanNode = (value: boolean): BooleanNode => {
  const node: BooleanNode = {
    type: NodeType.PRIMITIVE,
    primitive: Primitive.BOOLEAN,
    value,
  };

  node.scope = makeBooleanScope(node);

  return node;
};

const makeBooleanScope = (node: BooleanNode): Scope | undefined => {
  return;
};

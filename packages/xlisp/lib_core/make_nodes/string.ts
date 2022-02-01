import { NodeType, Primitive, Scope, StringNode } from "../../src";

export const makeStringNode = (value: string): StringNode => {
  const node: StringNode = {
    type: NodeType.PRIMITIVE,
    primitive: Primitive.STRING,
    value,
  };

  node.scope = makeStringScope(node);

  return node;
};

const makeStringScope = (node: StringNode): Scope | undefined => {
  return;
};

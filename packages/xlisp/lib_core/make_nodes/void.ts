import { NodeType, Primitive, Scope, VoidNode } from "../../src";

export const makeVoidNode = (value?: undefined): VoidNode => {
  const node: VoidNode = {
    type: NodeType.PRIMITIVE,
    primitive: Primitive.VOID,
    value,
  };

  node.scope = makeVoidScope(node);

  return node;
};

const makeVoidScope = (node: VoidNode): Scope | undefined => {
  return;
};

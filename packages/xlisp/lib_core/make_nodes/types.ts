import {
  Context,
  Interpreter,
  Node,
  Primitive,
  PrimitiveNode,
} from "../../src";

export type EvalPrimitive<TPrim extends Primitive> = (
  value: PrimitiveNode<TPrim>,
  interpreter: Interpreter,
  context: Context,
  ...args: Array<Node>
) => Node;

export interface PrimitiveEntries<TPrim extends Primitive> {
  [identifier: string]: EvalPrimitive<TPrim>;
}

import { makeBooleanNode } from "./boolean";
import { makeKeyNode } from "./key";
import { makeModuleNode } from "./module";
import { MakeNodes, MakePrimitiveNodes, Primitive } from "../../src";
import { makeNumberNode } from "./number";
import { makeStringNode } from "./string";
import { makeVoidNode } from "./void";
import { makeQuoteNode } from "./quote";

export const makePrimitiveNodes: MakePrimitiveNodes = {
  [Primitive.BOOLEAN]: makeBooleanNode,
  [Primitive.NUMBER]: makeNumberNode,
  [Primitive.STRING]: makeStringNode,
  [Primitive.VOID]: makeVoidNode,
};

export const makeNodes: MakeNodes = {
  Key: makeKeyNode,

  Module: makeModuleNode,

  Primitive: makePrimitiveNodes,

  Quote: makeQuoteNode,
};

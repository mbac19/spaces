import { Context } from ".";

export enum Primitive {
  BOOLEAN,
  NUMBER,
  STRING,
  VOID,
}

export interface PrimitiveToJS {
  [Primitive.BOOLEAN]: boolean;
  [Primitive.NUMBER]: number;
  [Primitive.STRING]: string;
  [Primitive.VOID]: undefined;
}

export const PrimitiveToDebugName = {
  [Primitive.BOOLEAN]: "boolean",
  [Primitive.NUMBER]: "number",
  [Primitive.STRING]: "string",
  [Primitive.VOID]: "void",
};

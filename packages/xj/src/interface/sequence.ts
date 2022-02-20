import { ASTNode } from "../ast";
import { Call, Efrl, Import, Number } from "./primitives";

export function Range(start: number, end?: number): ASTNode {
  const params =
    end === undefined ? [Number(start)] : [Number(start), Number(end)];

  return Efrl(Call(Import("std.range"), ...params));
}

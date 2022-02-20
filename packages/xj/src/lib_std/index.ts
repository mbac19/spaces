import { add } from "./add";
import { ASTNodeModule, ASTNodeType } from "../ast";
import { count } from "./count";
import { first } from "./first";
import { range } from "./range";

export const std: ASTNodeModule = {
  type: ASTNodeType.MODULE,

  exports: { add, count, first, range },
};

import { add } from "./add";
import { ASTNodeModule, ASTNodeType } from "../ast";
import { count } from "./count";
import { equals } from "./equals";
import { first } from "./first";
import { $in } from "./in";
import { list } from "./list";
import { range } from "./range";

export const std: ASTNodeModule = {
  type: ASTNodeType.MODULE,

  exports: { add, count, equals, first, in: $in, list, range },
};

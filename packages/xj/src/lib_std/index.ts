import { add } from "./add";
import { ASTNodeModule, ASTNodeType } from "../ast";
import { first, range } from "./sequence";

export const std: ASTNodeModule = {
  type: ASTNodeType.MODULE,

  exports: { add, first, range },
};

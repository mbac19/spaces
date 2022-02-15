import { add } from "./add";
import { ASTNodeModule, ASTNodeType } from "../ast";

export const std: ASTNodeModule = {
  type: ASTNodeType.MODULE,

  exports: { add },
};

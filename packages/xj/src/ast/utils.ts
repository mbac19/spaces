// -----------------------------------------------------------------------------
// TYPE GUARD
// -----------------------------------------------------------------------------

import { ASTNode, ASTNodeKey, ASTNodeType } from "./ast";

export function isKeyNode(node: ASTNode): node is ASTNodeKey {
  return node.type === ASTNodeType.KEY;
}

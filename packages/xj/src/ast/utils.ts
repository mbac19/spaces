// -----------------------------------------------------------------------------
// TYPE GUARD
// -----------------------------------------------------------------------------

import {
  ASTNode,
  ASTNodeCallable,
  ASTNodeKey,
  ASTNodeNumber,
  ASTNodeType,
  CALLABLE_TYPES,
} from "./ast";

export function isCallableNode(node: ASTNode): node is ASTNodeCallable {
  return CALLABLE_TYPES.includes(node.type);
}

export function isKeyNode(node: ASTNode): node is ASTNodeKey {
  return node.type === ASTNodeType.KEY;
}

export function isNumberNode(node: ASTNode): node is ASTNodeNumber {
  return node.type === ASTNodeType.NUMBER;
}

import {
  ASTNode,
  ASTNodeCallable,
  ASTNodeKey,
  ASTNodeNumber,
  ASTNodeType,
  CALLABLE_TYPES,
} from "./ast";

export function isTruthy(node: ASTNode): boolean {
  switch (node.type) {
    case ASTNodeType.BOOLEAN:
      return node.value;

    case ASTNodeType.VOID:
      return false;

    case ASTNodeType.NUMBER:
      return node.value !== 0;

    case ASTNodeType.STRING:
      return node.value !== "";

    case ASTNodeType.CALL:
    case ASTNodeType.DEFINE:
    case ASTNodeType.EFRL:
    case ASTNodeType.EFRM:
    case ASTNodeType.EXPORT:
    case ASTNodeType.FATAL_ERROR:
    case ASTNodeType.IMPORT:
    case ASTNodeType.KEY:
    case ASTNodeType.LAMBDA:
    case ASTNodeType.LOGICAL_AND:
    case ASTNodeType.LOGICAL_NOT:
    case ASTNodeType.LOGICAL_OR:
    case ASTNodeType.MODULE:
    case ASTNodeType.PARAM:
    case ASTNodeType.SYMBOL:
    case ASTNodeType.SYSTEM_REF:
      return true;
  }
}

// -----------------------------------------------------------------------------
// TYPE GUARD
// -----------------------------------------------------------------------------

export function isCallableNode(node: ASTNode): node is ASTNodeCallable {
  return CALLABLE_TYPES.includes(node.type);
}

export function isKeyNode(node: ASTNode): node is ASTNodeKey {
  return node.type === ASTNodeType.KEY;
}

export function isNumberNode(node: ASTNode): node is ASTNodeNumber {
  return node.type === ASTNodeType.NUMBER;
}

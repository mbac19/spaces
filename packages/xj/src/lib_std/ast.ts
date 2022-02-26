import {
  ASTNode,
  ASTNodeCallable,
  ASTNodeModule,
  ASTNodeReference,
  ASTNodeType,
  isModuleNode,
} from "../ast";
import { Scope } from "../context";

// -----------------------------------------------------------------------------
// SEQUENCE
// -----------------------------------------------------------------------------

export interface SequenceExports extends Scope {
  __iter__: ASTNodeCallable;
}

export interface SequenceNode extends ASTNodeModule<SequenceExports> {}

// -----------------------------------------------------------------------------
// RANGE
// -----------------------------------------------------------------------------

export const RangeSymbol = Symbol.for("Range");

export interface RangeExports extends SequenceExports {}

export interface RangeNode extends ASTNodeModule<RangeExports> {
  range: Symbol;
  start: number;
  end: number;
}

// -----------------------------------------------------------------------------
// LIST
// -----------------------------------------------------------------------------

export const ListSymbol = Symbol.for("List");

export interface ListExports extends SequenceExports {}

export interface ListNode extends ASTNodeModule<ListExports> {
  list: Symbol;
  nodes: Array<ASTNode>;
}

// -----------------------------------------------------------------------------
// ADDABLE
// -----------------------------------------------------------------------------

export interface AddableExports extends Scope {
  __add__: ASTNodeCallable | ASTNodeReference;
}

export interface AddableNode extends ASTNodeModule<AddableExports> {}

export function isAddable(node: ASTNode): node is AddableNode {
  return isModuleNode(node) && "__add__" in node.exports;
}

// -----------------------------------------------------------------------------
// EQUATABLE
// -----------------------------------------------------------------------------

export interface EquatableExports extends Scope {
  __eq__: ASTNodeCallable | ASTNodeReference;
}

export interface EquatableNodeModule extends ASTNodeModule<EquatableExports> {}

// -----------------------------------------------------------------------------
// TYPE GUARDS
// -----------------------------------------------------------------------------

export function isSequenceNode(node: ASTNode): node is SequenceNode {
  return node.type === ASTNodeType.MODULE && "__iter__" in node.exports;
}

export function isRangeNode(node: ASTNode): node is RangeNode {
  return (
    node.type === ASTNodeType.MODULE &&
    "range" in node &&
    node["range"] === RangeSymbol
  );
}

export function isListNode(node: ASTNode): node is ListNode {
  return (
    node.type === ASTNodeType.MODULE &&
    "list" in node &&
    node["list"] === ListSymbol
  );
}

export function isEquatableNodeModule(
  node: ASTNode
): node is EquatableNodeModule {
  return node.type === ASTNodeType.MODULE && "__eq__" in node.exports;
}

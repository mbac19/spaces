import { ASTNode, ASTNodeCallable, ASTNodeModule, ASTNodeType } from "../ast";
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

export interface ListExports extends SequenceExports {}

export interface ListNode extends ASTNodeModule<ListExports> {}

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

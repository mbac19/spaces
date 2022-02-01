import { Context } from "./context";
import { ID } from "./core";
import { Interpreter } from "./interpreter";
import { Primitive, PrimitiveToJS } from "./primitives";
import { Scope } from "./scope";

export enum NodeType {
  CALLABLE,
  IDENTIFIER,
  KEY,
  LIB_ENTRY,
  LIST,
  MODULE,
  NEVER,
  PRIMITIVE,
  QUOTE,
  SELF,
}

export type Eval = (
  interpreter: Interpreter,
  context: Context,
  ...args: Array<Node>
) => Node;

export enum LibEntryType {
  CALLABLE,
  RESOLVABLE,
}

// -----------------------------------------------------------------------------
// NODES
// -----------------------------------------------------------------------------

export interface CallableNode {
  type: NodeType.CALLABLE;
  value: Array<Node>;
}

// TODO: Rename this to Symbol
export interface IdentifierNode {
  type: NodeType.IDENTIFIER;
  value: ID;
}

export interface KeyNode {
  type: NodeType.KEY;
  value: string;
}

export interface LibEntryNode {
  type: NodeType.LIB_ENTRY;
  libType: LibEntryType;
  identifier: string;
  eval: Eval;
}

export interface LibEntryResolvableNode {}

export interface ListNode {
  type: NodeType.LIST;
  value: Array<Node>;
}

export interface NeverNode {
  type: NodeType.NEVER;
}

export interface PrimitiveNode<TPrim extends Primitive> {
  type: NodeType.PRIMITIVE;
  primitive: TPrim;
  scope?: Scope;
  value: PrimitiveToJS[TPrim];
}

export interface ModuleNode {
  type: NodeType.MODULE;
  dirname?: string;
  name?: string;
  scope: Scope;
}

export interface QuoteNode {
  type: NodeType.QUOTE;
  scope?: Scope;
  value: Array<Node>;
}

export interface SelfNode {
  type: NodeType.SELF;
}

// -----------------------------------------------------------------------------
// DERIVED NODE TYPES
// -----------------------------------------------------------------------------

export type BooleanNode = PrimitiveNode<Primitive.BOOLEAN>;

export type NumberNode = PrimitiveNode<Primitive.NUMBER>;

export type StringNode = PrimitiveNode<Primitive.STRING>;

export type VoidNode = PrimitiveNode<Primitive.VOID>;

export type Node =
  | BooleanNode
  | CallableNode
  | IdentifierNode
  | KeyNode
  | LibEntryNode
  | ListNode
  | ModuleNode
  | NeverNode
  | NumberNode
  | QuoteNode
  | SelfNode
  | StringNode
  | VoidNode;

// -----------------------------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------------------------

export const SELF_NODE: SelfNode = { type: NodeType.SELF };

export const NEVER_NODE: NeverNode = { type: NodeType.NEVER };

// -----------------------------------------------------------------------------
// NODE BUILDERS
// -----------------------------------------------------------------------------

export function makeCallableLibEntryNode(
  identifier: ID,
  evalFn: Eval
): LibEntryNode {
  return {
    type: NodeType.LIB_ENTRY,
    libType: LibEntryType.CALLABLE,
    identifier,
    eval: evalFn,
  };
}

export function makeResolvableLibEntryNode(
  identifier: ID,
  evalFn: Eval
): LibEntryNode {
  return {
    type: NodeType.LIB_ENTRY,
    libType: LibEntryType.RESOLVABLE,
    identifier,
    eval: evalFn,
  };
}

// -----------------------------------------------------------------------------
// MAKE PRIMITIVE SCOPE
// -----------------------------------------------------------------------------

export type MakePrimitiveNode<TPrim extends Primitive> = (
  value: PrimitiveToJS[TPrim]
) => PrimitiveNode<TPrim>;

export type MakePrimitiveNodes = {
  [Primitive.BOOLEAN]: MakePrimitiveNode<Primitive.BOOLEAN>;
  [Primitive.NUMBER]: MakePrimitiveNode<Primitive.NUMBER>;
  [Primitive.STRING]: MakePrimitiveNode<Primitive.STRING>;
  [Primitive.VOID]: MakePrimitiveNode<Primitive.VOID>;
};

export interface MakeNodes {
  Key: (value: string) => KeyNode;
  Module: (scope: Scope) => ModuleNode;
  Primitive: MakePrimitiveNodes;
  Quote: (nodes: Array<Node>) => QuoteNode;
}

// -----------------------------------------------------------------------------
// NODE UTILS
// -----------------------------------------------------------------------------

export function getNodeScope(node: Node): Scope | undefined {
  switch (node.type) {
    case NodeType.PRIMITIVE:
      return node.scope;

    case NodeType.MODULE:
      return node.scope;

    case NodeType.QUOTE:
      return node.scope;

    default:
      return undefined;
  }
}

// -----------------------------------------------------------------------------
// TYPE GUARDS AND ASSERTIONS
// -----------------------------------------------------------------------------

export function isNode(node: unknown): node is Node {
  if (!node) {
    return false;
  }

  return (
    typeof node === "function" ||
    Array.isArray(node) ||
    // @ts-ignore
    (typeof node === "object" && "type" in node)
  );
}

export function isIdentifierNode(node: Node): node is IdentifierNode {
  return node.type === NodeType.IDENTIFIER;
}

export function isKeyNode(node: Node): node is KeyNode {
  return node.type === NodeType.KEY;
}

export function isListNode(node: Node): node is ListNode {
  return Array.isArray(node);
}

export function isNumberNode(node: Node): node is NumberNode {
  return (
    node.type === NodeType.PRIMITIVE && node.primitive === Primitive.NUMBER
  );
}

export function isBooleanNode(node: Node): node is StringNode {
  return (
    node.type === NodeType.PRIMITIVE && node.primitive === Primitive.BOOLEAN
  );
}

export function isStringNode(node: Node): node is StringNode {
  return (
    node.type === NodeType.PRIMITIVE && node.primitive === Primitive.STRING
  );
}

export function assertIsListNode(node: Node): asserts node is ListNode {
  if (!isListNode(node)) {
    throw Error(`Expecting node to be list`);
  }
}

export function assertIsIdentifierNode(
  node: Node
): asserts node is IdentifierNode {
  if (!isIdentifierNode(node)) {
    throw Error("Expecting node to be IDENTIFIER");
  }
}

export function assertIsStringNode(node: Node): asserts node is StringNode {
  if (!isStringNode(node)) {
    throw Error("Expecting node to be type STRING");
  }
}

export function assertIsBooleanNode(node: Node): asserts node is BooleanNode {
  if (!isBooleanNode(node)) {
    throw Error("Expecting node to be type BOOLEAN");
  }
}

export function assertIsNumberNode(node: Node): asserts node is NumberNode {
  if (!isNumberNode(node)) {
    throw Error("Expcting node to be type NUMBER");
  }
}

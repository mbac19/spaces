import {
  assertIsStringNode,
  Node,
  NodeType,
  PrimitiveToDebugName,
} from "../src";

const TYPE_PROPERTY = "$type";

export class _Types {
  public typeOf(node: Node): string {
    switch (node.type) {
      case NodeType.CALLABLE: {
        return "callable";
      }

      case NodeType.IDENTIFIER: {
        return "symbol";
      }

      case NodeType.LIB_ENTRY: {
        return "lin-entry";
      }

      case NodeType.NEVER: {
        return "never";
      }

      case NodeType.MODULE: {
        if (TYPE_PROPERTY in node.scope) {
          const stringNode = node.scope[TYPE_PROPERTY];
          assertIsStringNode(stringNode);
          return stringNode.value;
        }

        return "namespace";
      }

      case NodeType.PRIMITIVE: {
        return PrimitiveToDebugName[node.primitive];
      }

      case NodeType.LIST: {
        return "list";
      }

      case NodeType.PRIMITIVE: {
      }
      case NodeType.SELF: {
        return "self";
      }
    }
  }
}

export const Types = new _Types();

import { Node, NodeType, Primitive } from "../src";

export class _Logger {
  public log(...args: Array<Node>) {
    console.log(this.serializeNodes(...args));
  }

  public serializeNodes(...nodes: Array<Node>): string {
    return nodes.map((n) => this.serializeNode(n)).join(" ");
  }

  private serializeNode(node: Node): string {
    switch (node.type) {
      case NodeType.CALLABLE: {
        return `<Func>`;
      }

      case NodeType.IDENTIFIER: {
        return node.value;
      }

      case NodeType.KEY: {
        return `:${node.value}`;
      }

      case NodeType.LIB_ENTRY: {
        return `<LibEntry:${node.identifier}>`;
      }

      case NodeType.LIST: {
        return "( ... )";
      }

      case NodeType.MODULE: {
        return `<Module:${node.name ?? "anon"}>`;
      }

      case NodeType.NEVER: {
        return "never";
      }

      case NodeType.PRIMITIVE: {
        return node.primitive === Primitive.VOID ? "()" : String(node.value);
      }

      case NodeType.QUOTE: {
        return `'( ... )`;
      }

      case NodeType.SELF: {
        return "self";
      }
    }
  }
}

export const Logger = new _Logger();

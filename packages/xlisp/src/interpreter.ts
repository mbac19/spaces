import * as Types from "./types";

import { Context } from "./context";
import { inject, injectable } from "inversify";
import { IParser } from "./parser";
import { IModSystem } from "./mod_system";
import { MakeNodes, ListNode, ModuleNode, Node, NodeType } from "./node";
import { ModuleSearchError } from "./errors";
import { Scope } from "./scope";
import { LibEntryType, Primitive } from ".";

@injectable()
export class Interpreter {
  private readonly globalModule: ModuleNode = {
    type: NodeType.MODULE,
    name: "global",
    scope: {},
  };

  constructor(
    @inject(Types.Parser)
    private readonly parser: IParser<unknown>,

    @inject(Types.ModSystem)
    private readonly modSystem: IModSystem<unknown>,

    @inject(Types.MakeNodes)
    private readonly makeNodes: MakeNodes
  ) {}

  public buildBaseContext(): Context {
    const baseScope: Scope = {};
    return new Context(undefined, baseScope, this.globalModule);
  }

  public import(context: Context, targetKey: string): Node {
    const search = { fromPath: context.getDirname(), targetKey };

    const path = this.modSystem.findModule(search);

    if (path === undefined) {
      throw new ModuleSearchError(
        `Could not find module for key: ${search.targetKey}`
      );
    }

    const source = this.modSystem.getModuleSource(path);

    const ast = this.parser.parse(source);

    const innerContext = new Context(context);

    return this.evalModule(ast, undefined, path, innerContext);
  }

  public eval(node: Node, context: Context): Node {
    switch (node.type) {
      case NodeType.PRIMITIVE: {
        return node;
      }

      case NodeType.CALLABLE: {
        return node;
      }

      case NodeType.IDENTIFIER: {
        const value = context.get(node.value);

        if (value === undefined) {
          throw Error(`Unrecognized symbol: ${node.value}`);
        }

        return this.eval(value, context);
      }

      case NodeType.KEY: {
        return node;
      }

      case NodeType.LIB_ENTRY: {
        switch (node.libType) {
          case LibEntryType.CALLABLE:
            return node;

          case LibEntryType.RESOLVABLE:
            return node.eval(this, context);
        }
      }

      case NodeType.LIST: {
        return this.evalList(node, context);
      }

      case NodeType.MODULE: {
        return node;
      }

      case NodeType.NEVER: {
        return node;
      }

      case NodeType.QUOTE: {
        return node;
      }

      case NodeType.SELF: {
        return context.getModule();
      }
    }
  }

  public evalModule(
    nodes: Array<Node>,
    modName: string | undefined,
    dirname: string | undefined,
    context: Context
  ): ModuleNode {
    const modScope: Scope = {};

    const mod: ModuleNode = {
      type: NodeType.MODULE,
      dirname,
      name: modName,
      scope: modScope,
    };

    const innerContext = new Context(context, {}, mod);

    for (const next of nodes) {
      this.eval(next, innerContext);
    }

    return mod;
  }

  private evalList(node: ListNode, context: Context): Node {
    if (node.value.length === 0) {
      return this.makeNodes.Primitive[Primitive.VOID](undefined);
    }

    const first = this.eval(node.value[0], context);

    const rest = node.value.slice(1);

    switch (first.type) {
      case NodeType.IDENTIFIER: {
        throw Error("Interpreter error. Expecting node to be evaluated");
      }

      case NodeType.CALLABLE: {
        const innerContext = new Context(context, undefined, undefined, []);

        // First, evaluate the parameters being passed into the function
        // and inject those parameters into the callable's context.
        for (const node of rest) {
          innerContext.appendParam(this.eval(node, context));
        }

        let result: Node | undefined;

        // Next, evaluate the function body itself.
        for (const node of first.value) {
          result = this.eval(node, innerContext);
        }

        return result ?? this.makeNodes.Primitive[Primitive.VOID](undefined);
      }

      case NodeType.LIB_ENTRY: {
        if (first.libType !== LibEntryType.CALLABLE) {
          throw Error(`Trying to call non-callable node type: ${first.type}`);
        }

        return first.eval(this, context, ...rest);
      }

      default: {
        throw Error(`Trying to call non-callable node type: ${first.type}`);
      }
    }
  }
}

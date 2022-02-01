import { ID } from "./core";
import { ModuleNode, Node } from "./node";
import { Scope } from "./scope";
import { assert, undefinedThrows } from "@levr/error_utils";
import { isKeyNode } from ".";

export interface IContext {
  get(identifier: ID): Node | undefined;

  /**
   * Sets a variable that is used internally within the scope. This will
   * overwrite values with the same identifier.
   */
  setLocal(identifier: ID, node: Node): void;

  /**
   * Merges a provided scope into the scope of the current context.
   */
  mergeScope(rhs: Scope): void;

  makeChildContext(localScope?: Scope): IContext;

  makeModuleContext(node: ModuleNode, localScope?: Scope): IModuleContext;
}

export interface IModuleContext extends IContext {
  getModule(): ModuleNode;

  /**
   * Sets a variable on the scope that will be exposed on the node.
   *
   * Note that the expose method is meant only for contexts associated
   * with modules.
   */
  setExposed(identifier: ID, node: Node): void;
}

export interface ICallableContext extends IContext {
  getParamAtIndex(idx: number): Node;

  getParamForKey(key: string): Node;

  appendParam(param: Node): void;
}

export class Context implements IContext {
  private unassignedKeyParam: string | undefined;

  private readonly keyToParam: Record<string, Node> | undefined;

  private readonly idxToParam: Array<Node> | undefined;

  constructor(
    public readonly parent: Context | undefined,
    private readonly localScope: Scope = {},
    public readonly module: ModuleNode | undefined = undefined,
    params: Array<Node> | undefined = undefined
  ) {
    this.parent = parent;
    this.localScope = localScope;

    if (params !== undefined) {
      this.keyToParam = {};
      this.idxToParam = [];

      for (const param of params) {
        this.appendParam(param);
      }
    }
  }

  public makeChildContext(localScope: Scope | undefined = undefined): IContext {
    return new Context(this, localScope, undefined, undefined);
  }

  public makeModuleContext(
    node: ModuleNode,
    localScope: Scope | undefined
  ): IModuleContext {
    return new Context(this, localScope, node, undefined);
  }

  public get(identifier: ID): Node | undefined {
    if (identifier in this.localScope) {
      return this.localScope[identifier];
    } else if (this.module !== undefined && identifier in this.module.scope) {
      return this.module.scope[identifier];
    } else if (this.parent !== undefined) {
      return this.parent.get(identifier);
    }
  }

  public getParamAtIndex(idx: number): Node {
    if (this.idxToParam === undefined) {
      throw Error("Trying to access param in context that is not callable");
    }

    if (idx >= this.idxToParam.length) {
      throw Error("Trying to access out-of-bounds param index");
    }

    return this.idxToParam[idx];
  }

  public getParamForKey(key: string): Node {
    if (this.keyToParam === undefined) {
      throw Error("Trying access param in context that is not callable");
    }

    if (!(key in this.keyToParam)) {
      throw Error(`No param associated with key: ${key}`);
    }

    return this.keyToParam[key];
  }

  /**
   * The number of parameters. This should only be used within a
   * callable context.
   */
  public getParamsLength(): number {
    undefinedThrows(
      this.idxToParam,
      "Calling getParamsLength() on a non-callable context"
    );

    return this.idxToParam.length;
  }

  public getModule(): ModuleNode {
    if (this.module !== undefined) {
      return this.module;
    }

    const namespace = this.parent?.getModule();
    undefinedThrows(namespace);
    return namespace;
  }

  /**
   * Get the directory within the runtime's file system where we are running
   * the current module. Every program is run from a particular path.
   */
  public getDirname(): string {
    if (this.module !== undefined && this.module.dirname !== undefined) {
      return this.module.dirname;
    }

    if (this.parent === undefined) {
      throw Error("Context is missing a runtime path. This is very bad");
    }

    return this.parent.getDirname();
  }

  /**
   * Should be used when the context represents something callable.
   * Appends a parameter to the context which can be read by the callable.
   */
  public appendParam(param: Node) {
    if (this.idxToParam === undefined) {
      throw Error("Context not configured to be callable");
    }

    if (this.unassignedKeyParam !== undefined) {
      assert(
        !isKeyNode(param),
        `No parameter associated with key: ${this.unassignedKeyParam}`
      );

      this.keyToParam![this.unassignedKeyParam] = param;
      this.unassignedKeyParam = undefined;
    }

    if (isKeyNode(param)) {
      this.unassignedKeyParam = param.value;
      return;
    }

    this.idxToParam.push(param);
  }

  public mergeScope(scope: Scope) {
    Object.assign(this.localScope, scope);
  }

  public setLocal(identifier: ID, value: Node) {
    this.localScope[identifier] = value;
  }

  public setExposed(identifier: ID, value: Node) {
    if (this.module === undefined) {
      throw Error("Trying to export a variable outside the scope of a module");
    }
    this.module.scope[identifier] = value;
  }
}

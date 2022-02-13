import { assert, undefinedThrows } from "@levr/error_utils";
import { ASTNode, ASTNodeModule, isKeyNode } from "../ast";
import { Scope } from "./scope";

export interface IContext {
  get(symbol: string): ASTNode | undefined;

  /**
   * Sets a variable that is used internally within the scope. This will
   * overwrite values with the same identifier.
   */
  setLocal(identifier: string, node: ASTNode): void;

  /**
   * Merges a provided scope into the scope of the current context.
   */
  mergeScope(rhs: Scope): void;

  makeChildContext(localScope?: Scope): IContext;

  makeModuleContext(node: ASTNodeModule, localScope?: Scope): IModuleContext;
}

/**
 * A context from within a module.
 */
export interface IModuleContext extends IContext {
  getModule(): ASTNodeModule;

  /**
   * Sets a variable on the scope that will be exposed on the node.
   *
   * Note that the expose method is meant only for contexts associated
   * with modules.
   */
  setExposed(identifier: string, node: ASTNode): void;
}

/**
 * A context within a callable.
 */
export interface ICallableContext extends IContext {
  getParamAtIndex(idx: number): ASTNode;

  getParamForKey(key: string): ASTNode;

  appendParam(param: ASTNode): void;
}

export interface ContextDef {
  localScope?: Scope | undefined;
  module?: ASTNodeModule;
  params?: Array<ASTNode>;
  parent?: Context;
}

export class Context implements IContext {
  private unassignedKeyParam: string | undefined;

  private readonly keyToParam: Record<string, ASTNode> | undefined;

  private readonly idxToParam: Array<ASTNode> | undefined;

  private readonly parent: Context | undefined;

  private readonly localScope: Scope;

  private readonly module: ASTNodeModule | undefined;

  constructor(def: ContextDef) {
    this.parent = def.parent;
    this.localScope = def.localScope ?? {};

    if (def.params !== undefined) {
      this.keyToParam = {};
      this.idxToParam = [];

      for (const param of def.params) {
        this.appendParam(param);
      }
    }
  }

  public makeChildContext(localScope: Scope | undefined = undefined): IContext {
    return new Context({ localScope, parent: this });
  }

  public makeModuleContext(
    node: ASTNodeModule,
    localScope: Scope | undefined
  ): IModuleContext {
    return new Context({ localScope, module: node, parent: this });
  }

  public get(identifier: string): ASTNode | undefined {
    if (this.localScope !== undefined && identifier in this.localScope) {
      return this.localScope[identifier];
    } else if (this.module !== undefined && identifier in this.module.scope) {
      return this.module.scope[identifier];
    } else if (this.parent !== undefined) {
      return this.parent.get(identifier);
    }
  }

  public getParamAtIndex(idx: number): ASTNode {
    if (this.idxToParam === undefined) {
      throw Error("Trying to access param in context that is not callable");
    }

    if (idx >= this.idxToParam.length) {
      throw Error("Trying to access out-of-bounds param index");
    }

    return this.idxToParam[idx];
  }

  public getParamForKey(key: string): ASTNode {
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

  public getModule(): ASTNodeModule {
    if (this.module !== undefined) {
      return this.module;
    }

    const namespace = this.parent?.getModule();
    undefinedThrows(namespace);
    return namespace;
  }

  /**
   * Should be used when the context represents something callable.
   * Appends a parameter to the context which can be read by the callable.
   */
  public appendParam(param: ASTNode) {
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
      this.unassignedKeyParam = param.key;
      return;
    }

    this.idxToParam.push(param);
  }

  public mergeScope(scope: Scope) {
    Object.assign(this.localScope, scope);
  }

  public setLocal(identifier: string, value: ASTNode) {
    this.localScope[identifier] = value;
  }

  public setExposed(identifier: string, value: ASTNode) {
    if (this.module === undefined) {
      throw Error("Trying to export a variable outside the scope of a module");
    }
    this.module.scope[identifier] = value;
  }
}

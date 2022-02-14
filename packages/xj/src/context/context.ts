import { assert, undefinedThrows } from "@levr/error_utils";
import { ASTNode, ASTNodeModule, ASTNodeType, isKeyNode } from "../ast";
import { InvalidDefinitionError, UnresolvedReferenceError } from "../errors";
import { Scope } from "./scope";

const VARIABLE_IDENTIFIER = /^[a-zA-Z][a-zA-Z\-\?_\$]*$/;

export interface IContext {
  get(symbol: string): ASTNode | undefined;

  getTokenized(tokens: Array<string>): ASTNode | undefined;

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

  makeChildCallableContext(
    params: Array<ASTNode>,
    localScope?: Scope
  ): ICallableContext;

  makeChildModuleContext(localScope?: Scope): IModuleContext;

  asModuleContext(): IModuleContext | undefined;
}

/**
 * A context from within a form that is in the process of creating a module.
 */
export interface IModuleContext extends IContext {
  /**
   * Generate a module node from the current context.
   */
  makeModule(): ASTNodeModule;

  /**
   * Sets a variable on the scope that will be exposed on the node.
   *
   * Note that the expose method is meant only for contexts associated
   * with modules.
   */
  setExport(identifier: string, node: ASTNode): void;
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
  localScope?: Scope;
  moduleScope?: Scope;
  params?: Array<ASTNode>;
  parent?: Context;
}

export class Context implements IContext, ICallableContext, IModuleContext {
  private unassignedKeyParam: string | undefined;

  public readonly keyToParam: Record<string, ASTNode> | undefined;

  public readonly idxToParam: Array<ASTNode> | undefined;

  public readonly parent: Context | undefined;

  private readonly localScope: Scope;

  public readonly moduleExports: Scope | undefined;

  private readonly moduleScope: Scope | undefined;

  constructor(def: ContextDef) {
    this.parent = def.parent;
    this.localScope = def.localScope ?? {};

    if (def.moduleScope !== undefined) {
      this.moduleScope = def.moduleScope;
      this.moduleExports = {};
    }

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

  public makeChildCallableContext(
    params: Array<ASTNode>,
    localScope: Scope | undefined = undefined
  ): ICallableContext {
    return new Context({ localScope, params, parent: this });
  }

  public makeChildModuleContext(localScope: Scope | undefined): IModuleContext {
    return new Context({ localScope, moduleScope: {}, parent: this });
  }

  public makeModule(): ASTNodeModule {
    if (this.moduleExports === undefined || this.moduleScope === undefined) {
      throw Error("Trying to make a module from an invalid context");
    }

    return {
      type: ASTNodeType.MODULE,
      exports: this.moduleExports,
    };
  }

  public asModuleContext(): IModuleContext | undefined {
    return this.moduleExports === undefined ? undefined : this;
  }

  public get(identifier: string): ASTNode | undefined {
    return this.getTokenized(identifier.split("."));
  }

  public getTokenized(tokens: Array<string>): ASTNode | undefined {
    if (tokens.length === 0) {
      return;
    }

    const first = tokens[0];

    let node: ASTNode;

    if (this.localScope !== undefined && first in this.localScope) {
      node = this.localScope[first];
    } else if (this.moduleScope !== undefined && first in this.moduleScope) {
      node = this.moduleScope[first];
    } else if (this.parent !== undefined) {
      return this.parent.getTokenized(tokens);
    } else {
      throw new UnresolvedReferenceError();
    }

    for (let i = 1; i < tokens.length; ++i) {
      // TODO: IMPLEMENT ME!
    }

    return node;
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
    if (!VARIABLE_IDENTIFIER.test(identifier)) {
      throw new InvalidDefinitionError();
    }

    this.localScope[identifier] = value;
  }

  public setExport(identifier: string, value: ASTNode) {
    if (this.moduleExports === undefined) {
      throw Error("Trying to export a variable outside the scope of a module");
    }

    this.moduleExports[identifier] = value;
  }
}

// -----------------------------------------------------------------------------
// TYPE GUARDS
// -----------------------------------------------------------------------------

export function isCallableContext(
  context: IContext
): context is ICallableContext {
  return context instanceof Context && context.keyToParam !== undefined;
}

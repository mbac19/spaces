import * as Types from "../types";

import { AnyLibCallable, Lib } from "../lib";
import {
  ASTNode,
  ASTNodeBoolean,
  ASTNodeType,
  ASTNodeVoid,
  isCallableNode,
  isTruthy,
} from "../ast";
import { IContext, isCallableContext } from "../context";
import { inject, injectable } from "inversify";
import { Interpreter } from "./interpreter";
import {
  InvalidArguments,
  InvalidCallError,
  MalformedProgramError,
  RuntimeFatalError,
  UnresolvedReferenceError,
  UnresolvedSystemCall,
} from "../errors";

@injectable()
export class STDInterpreter implements Interpreter {
  private readonly libSymbols: Record<string, AnyLibCallable>;

  constructor(@inject(Types.Libs) private readonly libs: Array<Lib>) {
    const libSymbols: Record<string, AnyLibCallable> = {};

    for (const lib of libs) {
      for (const callable of Object.values(lib)) {
        libSymbols[callable.symbol] = callable;
      }
    }

    this.libSymbols = libSymbols;
  }

  public eval(context: IContext, node: ASTNode): ASTNode {
    switch (node.type) {
      case ASTNodeType.BOOLEAN:
        return node;

      case ASTNodeType.CALL: {
        const callable = this.eval(context, node.callable);
        return this.evalCall(context, callable, node.params);
      }

      case ASTNodeType.DEFINE:
        context.setLocal(node.symbol, node.value);
        return { type: ASTNodeType.SYMBOL, value: node.symbol };

      case ASTNodeType.EFRL: {
        const innerContext = context.makeChildContext();

        let last: ASTNode | undefined;

        for (const next of node.form) {
          last = this.eval(innerContext, next);
        }

        return last ?? VOID_NODE;
      }

      case ASTNodeType.EFRM: {
        const innerContext = context.makeChildModuleContext();

        for (const next of node.form) {
          this.eval(innerContext, next);
        }

        return innerContext.makeModule();
      }

      case ASTNodeType.EXPORT: {
        const moduleContext = context.asModuleContext();

        if (moduleContext === undefined) {
          throw new MalformedProgramError();
        }

        const next = this.eval(moduleContext, node.value);

        moduleContext.setExport(node.symbol, next);

        return { type: ASTNodeType.SYMBOL, value: node.symbol };
      }

      case ASTNodeType.FATAL_ERROR: {
        throw new RuntimeFatalError(node.message);
      }

      case ASTNodeType.LAMBDA:
        return node;

      case ASTNodeType.LOGICAL_AND: {
        if (node.value.length < 2) {
          throw new InvalidArguments();
        }

        let last: ASTNode;

        for (const next of node.value) {
          last = this.eval(context, next);

          if (!isTruthy(last)) {
            return last;
          }
        }

        // @ts-ignore
        return last;
      }

      case ASTNodeType.LOGICAL_NOT:
        return isTruthy(this.eval(context, node.value))
          ? FALSE_NODE
          : TRUE_NODE;

      case ASTNodeType.LOGICAL_OR: {
        if (node.value.length < 2) {
          throw new InvalidArguments();
        }

        let last: ASTNode;

        for (const next of node.value) {
          last = this.eval(context, next);

          if (isTruthy(last)) {
            return last;
          }
        }

        // @ts-ignore
        return last;
      }

      case ASTNodeType.MODULE:
        return node;

      case ASTNodeType.NUMBER:
        return node;

      case ASTNodeType.PARAM:
        if (!isCallableContext(context)) {
          throw new MalformedProgramError(
            "Trying to get param outside of a callable"
          );
        }
        return typeof node.ref === "number"
          ? context.getParamAtIndex(node.ref)
          : context.getParamForKey(node.ref);

      case ASTNodeType.STRING:
        return node;

      case ASTNodeType.SYMBOL: {
        const result = context.get(node.value);

        if (result === undefined) {
          throw new UnresolvedReferenceError();
        }

        return result;
      }

      case ASTNodeType.SYSTEM_REF:
        return node;

      case ASTNodeType.VOID:
        return node;
    }

    throw Error(`Unhandled node type: ${node.type}`);
  }

  public evalCall(
    context: IContext,
    callable: ASTNode,
    params: Array<ASTNode>
  ): ASTNode {
    if (!isCallableNode(callable)) {
      throw new InvalidCallError();
    }

    switch (callable.type) {
      case ASTNodeType.LAMBDA: {
        const innerContext = context.makeChildCallableContext(params);

        let last: ASTNode | undefined;

        for (const node of callable.body) {
          last = this.eval(innerContext, node);
        }

        return last ?? VOID_NODE;
      }

      case ASTNodeType.SYSTEM_REF: {
        const systemCallable = this.libSymbols[callable.symbol];

        if (systemCallable === undefined) {
          throw new UnresolvedSystemCall();
        }

        return systemCallable.call(context, this, ...params);
      }
    }
  }
}

// -----------------------------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------------------------

const VOID_NODE: ASTNodeVoid = { type: ASTNodeType.VOID };

const TRUE_NODE: ASTNodeBoolean = { type: ASTNodeType.BOOLEAN, value: true };

const FALSE_NODE: ASTNodeBoolean = { type: ASTNodeType.BOOLEAN, value: false };

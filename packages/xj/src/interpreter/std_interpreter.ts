import { ASTNode, ASTNodeCallable, ASTNodeType, ASTNodeVoid } from "../ast";
import { ICallableContext, IContext } from "../context";
import { injectable } from "inversify";
import { Interpreter } from "./interpreter";
import { MalformedProgramError, UnresolvedReferenceError } from "../errors";

@injectable()
export class STDInterpreter implements Interpreter {
  public eval(context: IContext, node: ASTNode): ASTNode {
    switch (node.type) {
      case ASTNodeType.BOOLEAN:
        return node;

      case ASTNodeType.CALL: {
        const innerContext = context.makeChildCallableContext(node.params);
        return this.evalCall(innerContext, node.callable, node.params);
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

      case ASTNodeType.LAMBDA:
        return node;

      case ASTNodeType.NUMBER:
        return node;

      case ASTNodeType.STRING:
        return node;

      case ASTNodeType.SYMBOL: {
        const result = context.get(node.value);

        if (result === undefined) {
          throw new UnresolvedReferenceError();
        }

        return result;
      }

      case ASTNodeType.VOID:
        return node;
    }

    throw Error(`Unhandled node type: ${node.type}`);
  }

  public evalCall(
    context: ICallableContext,
    callable: ASTNodeCallable,
    params: Array<ASTNode>
  ): ASTNode {
    switch (callable.type) {
      case ASTNodeType.LAMBDA: {
        let last: ASTNode | undefined;
        for (const node of callable.body) {
          last = this.eval(context, node);
        }
        return last || VOID_NODE;
      }

      case ASTNodeType.SYSTEM_REF: {
        throw Error("NOT YET IMPLEMENTED");
      }
    }
  }
}

// -----------------------------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------------------------

const VOID_NODE: ASTNodeVoid = { type: ASTNodeType.VOID };

import { ASTNode, ASTNodeType } from "../ast";
import { IContext } from "../context";
import { injectable } from "inversify";
import { Interpreter } from "./interpreter";
import { MalformedProgramError, UnresolvedReferenceError } from "../errors";

@injectable()
export class STDInterpreter implements Interpreter {
  public eval(context: IContext, node: ASTNode): ASTNode {
    switch (node.type) {
      case ASTNodeType.BOOLEAN:
        return node;

      case ASTNodeType.DEFINE:
        context.setLocal(node.symbol, node.value);
        return { type: ASTNodeType.SYMBOL, value: node.symbol };

      case ASTNodeType.EFRL: {
        if (node.form.length === 0) {
          throw new MalformedProgramError();
        }

        const innerContext = context.makeChildContext();

        let last: ASTNode;

        for (const next of node.form) {
          last = this.eval(innerContext, next);
        }

        // @ts-ignore - Will always be assigned.
        return last;
      }

      case ASTNodeType.NUMBER:
        return node;

      case ASTNodeType.STRING:
        return node;

      case ASTNodeType.SYMBOL: {
        const result = context.get(node.value);

        console.log(result);
        if (result === undefined) {
          throw new UnresolvedReferenceError();
        }

        return result;
      }
    }

    throw Error(`Unhandled node type: ${node.type}`);
  }
}

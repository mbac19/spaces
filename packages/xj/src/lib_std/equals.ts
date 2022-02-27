import { ASTNode, ASTNodeSystemCallable, ASTNodeType } from "../ast";
import { IContext } from "../context";
import { IncorrectArguments } from "../errors";
import { Interpreter } from "../interpreter";
import { isEquatableNodeModule } from "./ast";

export const equals: ASTNodeSystemCallable = {
  type: ASTNodeType.SYSTEM_CALLABLE,

  call(
    context: IContext,
    interpreter: Interpreter,
    ...params: Array<ASTNode>
  ): ASTNode {
    if (params.length !== 2) {
      throw new IncorrectArguments(`Expecting 2 arguments passed into std.eq`);
    }

    const first = interpreter.eval(context, params[0]);
    const second = interpreter.eval(context, params[1]);

    if (isEquatableNodeModule(first)) {
      return interpreter.evalCall(context, first.exports.__eq__, [second]);
    } else if (isEquatableNodeModule(second)) {
      return interpreter.evalCall(context, second.exports.__eq__, [first]);
    }

    const value = fallbackEquals(first, second);

    return { type: ASTNodeType.BOOLEAN, value };
  },
};

// TODO: Need to make this recursive, may need to evaluate equality through
// sub-nodes.
function fallbackEquals(first: ASTNode, second: ASTNode): boolean {
  switch (first.type) {
    case ASTNodeType.BOOLEAN:
      return (
        second.type === ASTNodeType.BOOLEAN && first.value === second.value
      );

    case ASTNodeType.CALL:
      return first === second;

    case ASTNodeType.DEFINE:
      return first === second;

    case ASTNodeType.EFRL:
      return first === second;

    case ASTNodeType.EFRM:
      return first === second;

    case ASTNodeType.EXPORT:
      return first === second;

    case ASTNodeType.FATAL_ERROR:
      return first === second;

    case ASTNodeType.IMPORT:
      return first === second;

    case ASTNodeType.KEY:
      return first === second;

    case ASTNodeType.LAMBDA:
      return first === second;

    case ASTNodeType.LOGICAL_AND:
      return first === second;

    case ASTNodeType.LOGICAL_NOT:
      return first === second;

    case ASTNodeType.LOGICAL_OR:
      return first === second;

    case ASTNodeType.MATCH:
      return first === second;

    case ASTNodeType.MODULE:
      // TODO: Need to recursively check this. Need to evaluate.
      return first === second;

    case ASTNodeType.NUMBER:
      return second.type === ASTNodeType.NUMBER && first.value === second.value;

    case ASTNodeType.PARAM:
      return first === second;

    case ASTNodeType.STRING:
      return second.type === ASTNodeType.STRING && first.value === second.value;

    case ASTNodeType.SYMBOL:
      return second.type === ASTNodeType.SYMBOL && first.value === second.value;

    case ASTNodeType.SYSTEM_CALLABLE:
      return first === second;

    case ASTNodeType.VOID:
      return second.type === ASTNodeType.VOID;
  }
}

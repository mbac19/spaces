import { ASTNode, ASTNodeSystemCallable, ASTNodeType } from "../ast";
import { IContext } from "../context";
import { IncorrectArguments } from "../errors";
import { Interpreter } from "../interpreter";
import { isSequenceNode } from "./ast";

export const first: ASTNodeSystemCallable = {
  type: ASTNodeType.SYSTEM_CALLABLE,

  call(
    context: IContext,
    interpreter: Interpreter,
    ...params: Array<ASTNode>
  ): ASTNode {
    if (params.length !== 1) {
      throw new IncorrectArguments(
        `Incorrect number of arguments passed to std.first`
      );
    }

    const sequence = interpreter.eval(context, params[0]);

    if (!isSequenceNode(sequence)) {
      throw new IncorrectArguments("Expecting first argument to be sequence");
    }

    return interpreter.evalCall(context, sequence.exports.__iter__, [
      { type: ASTNodeType.NUMBER, value: 0 },
    ]);
  },
};

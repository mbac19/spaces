import { ASTNode, ASTNodeSystemCallable, ASTNodeType } from "../ast";
import { IContext } from "../context";
import { IncorrectArguments } from "../errors";
import { Interpreter } from "../interpreter";
import { isRangeNode } from "./ast";

export const count: ASTNodeSystemCallable = {
  type: ASTNodeType.SYSTEM_CALLABLE,

  call(
    context: IContext,
    interpreter: Interpreter,
    ...params: Array<ASTNode>
  ): ASTNode {
    if (params.length !== 1) {
      throw new IncorrectArguments(
        "Incorrect number of arguments passed to std.count"
      );
    }

    const sequence = interpreter.eval(context, params[0]);

    if (isRangeNode(sequence)) {
      return {
        type: ASTNodeType.NUMBER,
        value: Math.max(sequence.end - sequence.start),
      };
    }

    throw new IncorrectArguments("Cannot count parameter");
  },
};

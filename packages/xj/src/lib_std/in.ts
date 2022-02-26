import {
  ASTNode,
  ASTNodeSystemCallable,
  ASTNodeType,
  isNumberNode,
} from "../ast";
import { IContext } from "../context";
import { IncorrectArguments } from "../errors";
import { Interpreter } from "../interpreter";
import { isRangeNode } from "./ast";

export const $in: ASTNodeSystemCallable = {
  type: ASTNodeType.SYSTEM_CALLABLE,

  call(
    context: IContext,
    interpreter: Interpreter,
    ...params: Array<ASTNode>
  ): ASTNode {
    if (params.length !== 2) {
      throw new IncorrectArguments(
        "Incorrect number of arguments passed to std.in"
      );
    }

    const operand = interpreter.eval(context, params[0]);
    const sequence = interpreter.eval(context, params[1]);

    if (isRangeNode(sequence)) {
      return {
        type: ASTNodeType.BOOLEAN,
        value:
          isNumberNode(operand) &&
          operand.value < sequence.end &&
          operand.value >= sequence.start,
      };
    }

    throw new IncorrectArguments("Expecting second parameter to be a sequence");
  },
};

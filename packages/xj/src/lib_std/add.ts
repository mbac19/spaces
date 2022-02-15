import { ASTNode, ASTNodeSystemCallable, ASTNodeType } from "../ast/ast";
import { IContext } from "../context";
import { Interpreter } from "../interpreter";
import { TypeConstraintError } from "../errors";
import { isNumberNode } from "../ast";

export const add: ASTNodeSystemCallable = {
  type: ASTNodeType.SYSTEM_CALLABLE,

  call(
    context: IContext,
    interpreter: Interpreter,
    ...params: Array<ASTNode>
  ): ASTNode {
    const innerContext = context.makeChildContext();

    let total = 0;

    for (const param of params) {
      const evaledParam = interpreter.eval(innerContext, param);

      if (!isNumberNode(evaledParam)) {
        throw new TypeConstraintError();
      }

      total += evaledParam.value;
    }

    return { type: ASTNodeType.NUMBER, value: total };
  },
};

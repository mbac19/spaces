import { ASTNode, ASTNodeType } from "../ast/ast";
import { IContext } from "../context";
import { Interpreter } from "../interpreter";
import { LibCallable } from "../lib";
import { NAMESPACE } from "./constants";
import { TypeConstraintError } from "../errors";
import { isNumberNode } from "../ast";

export const Add: LibCallable<Array<ASTNode>, ASTNode> = {
  symbol: `${NAMESPACE}.add`,

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

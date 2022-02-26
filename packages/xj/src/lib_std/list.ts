import { assertProgram } from "../errors";
import {
  assertNumberNode,
  ASTNode,
  ASTNodeSystemCallable,
  ASTNodeType,
} from "../ast";
import { IContext } from "../context";
import { Interpreter } from "../interpreter";
import { ListNode, ListSymbol } from "./ast";

export const list: ASTNodeSystemCallable = {
  type: ASTNodeType.SYSTEM_CALLABLE,

  call(
    listContext: IContext,
    interpreter: Interpreter,
    ...listParams: Array<ASTNode>
  ): ListNode {
    return {
      type: ASTNodeType.MODULE,

      exports: {
        __iter__: {
          type: ASTNodeType.SYSTEM_CALLABLE,
          call(
            _context: IContext,
            _interpreter: Interpreter,
            ...params: Array<ASTNode>
          ): ASTNode {
            assertProgram(params.length === 1);
            const node = params[0];
            assertNumberNode(node);

            const idx = node.value;

            if (idx >= listParams.length) return { type: ASTNodeType.VOID };

            return interpreter.eval(listContext, listParams[idx]);
          },
        },
      },

      list: ListSymbol,

      nodes: listParams,
    };
  },
};

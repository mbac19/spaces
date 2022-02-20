import { assertProgram, IncorrectArguments } from "../errors";
import {
  assertNumberNode,
  ASTNode,
  ASTNodeSystemCallable,
  ASTNodeType,
  isNumberNode,
} from "../ast";
import { IContext } from "../context";
import { Interpreter } from "../interpreter";
import { RangeNode, RangeSymbol } from "./ast";

export const range: ASTNodeSystemCallable = {
  type: ASTNodeType.SYSTEM_CALLABLE,

  call(
    context: IContext,
    interpreter: Interpreter,
    ...params: Array<ASTNode>
  ): RangeNode {
    if (params.length !== 1 && params.length !== 2) {
      throw new IncorrectArguments(
        `Incorrect number of arguments passed to std.range`
      );
    }

    // TODO: Would like to add support for a "countable" module to abstract
    // increment and decrement.
    const evaledParams: Array<number> = params.map((p) => {
      const node = interpreter.eval(context, p);
      if (!isNumberNode(node)) {
        throw new IncorrectArguments(`std.range requires number parameters`);
      }
      return node.value;
    });

    let start: number;
    let end: number;

    if (params.length === 1) {
      start = 0;
      end = evaledParams[0];
    } else {
      start = evaledParams[0];
      end = evaledParams[1];
    }

    const count = end - start;

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

            if (idx >= count) {
              return { type: ASTNodeType.VOID };
            }

            return { type: ASTNodeType.NUMBER, value: start + idx };
          },
        },
      },
      range: RangeSymbol,
      start,
      end,
    };
  },
};

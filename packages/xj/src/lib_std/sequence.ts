import { assertProgram, IncorrectArguments } from "../errors";
import {
  assertNumberNode,
  ASTNode,
  ASTNodeCallable,
  ASTNodeModule,
  ASTNodeSystemCallable,
  ASTNodeType,
  isNumberNode,
} from "../ast";
import { IContext } from "../context";
import { Interpreter } from "../interpreter";
import { Scope } from "../context";

export interface SequenceExports extends Scope {
  __iter__: ASTNodeCallable;
}

export interface SequenceNode extends ASTNodeModule<SequenceExports> {}

export function isSequenceNode(node: ASTNode): node is SequenceNode {
  return node.type === ASTNodeType.MODULE && "__iter__" in node.exports;
}

export const range: ASTNodeSystemCallable = {
  type: ASTNodeType.SYSTEM_CALLABLE,

  call(
    context: IContext,
    interpreter: Interpreter,
    ...params: Array<ASTNode>
  ): SequenceNode {
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
    };
  },
};

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

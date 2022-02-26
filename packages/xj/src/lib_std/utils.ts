import { ASTNode, ASTNodeType, isVoidNode } from "../ast";
import { IContext } from "../context";
import { Interpreter } from "../interpreter";
import { SequenceNode } from "./ast";

export function iterableSequence(
  context: IContext,
  interpreter: Interpreter,
  seq: SequenceNode
): Iterable<ASTNode> {
  return {
    [Symbol.iterator]: () => {
      let i = 0;
      return {
        next(): IteratorResult<ASTNode, undefined> {
          const node = interpreter.eval(context, {
            type: ASTNodeType.CALL,
            callable: seq.exports.__iter__,
            params: [{ type: ASTNodeType.NUMBER, value: i }],
          });

          i += 1;

          if (isVoidNode(node)) {
            return { done: true, value: undefined };
          } else {
            return { value: node };
          }
        },
      };
    },
  };
}

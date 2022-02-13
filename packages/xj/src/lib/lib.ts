import { ASTNode } from "../ast/ast";
import { Context } from "../context";
import { Interpreter } from "../interpreter";

export type Lib = Record<string, LibCallable<Array<ASTNode>, ASTNode>>;

export interface LibCallable<
  TParams extends Array<ASTNode>,
  TReturn extends ASTNode
> {
  readonly symbol: string;

  call: (
    context: Context,
    interpreter: Interpreter,
    ...params: TParams
  ) => TReturn;
}

import { ASTNode } from "../ast/ast";
import { IContext } from "../context";
import { Interpreter } from "../interpreter";

export type Lib = Record<string, LibCallable<Array<ASTNode>, ASTNode>>;

export interface LibCallable<
  TParams extends Array<ASTNode>,
  TReturn extends ASTNode
> {
  readonly symbol: string;

  call: (
    context: IContext,
    interpreter: Interpreter,
    ...params: TParams
  ) => TReturn;
}

export type AnyLibCallable = LibCallable<Array<ASTNode>, ASTNode>;

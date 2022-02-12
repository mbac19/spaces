import { ASTNode } from "../ast/ast";

export type Lib = LibCallable | LibModule;

export interface LibCallable {
  readonly isCallable: true;

  readonly name: string;

  call: (...params: Array<ASTNode>) => ASTNode;
}

export interface LibModule {
  readonly isModule: true;

  readonly name: string;

  readonly entries: { [key: string]: LibCallable | LibModule };
}

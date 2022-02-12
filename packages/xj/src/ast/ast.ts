export type ASTNode = ASTNodeModule | ASTNodeNumber | ASTNodeString;

export enum ASTNodeType {
  MODULE = "MODULE",
  NUMBER = "NUMBER",
  STRING = "STRING",
}

export interface ASTNodeModule {
  type: ASTNodeType.MODULE;
  module: { [symbol: string]: ASTNode };
}

export interface ASTNodeNumber {
  type: ASTNodeType.NUMBER;
}

export interface ASTNodeString {
  type: ASTNodeType.STRING;
}

import { ModuleNode, NodeType, Scope } from "../../src";

export function makeModuleNode(scope: Scope): ModuleNode {
  return {
    type: NodeType.MODULE,
    dirname: undefined,
    name: undefined,
    scope,
  };
}

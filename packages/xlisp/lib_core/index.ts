import * as entries from "./entries";

import { ModuleNode, NodeType, Scope } from "../src";

export const lib: ModuleNode = {
  type: NodeType.MODULE,
  dirname: undefined,
  name: "lib-core",
  scope: Object.values(entries).reduce((acc, entry) => {
    acc[entry.identifier] = entry;
    return acc;
  }, {} as Scope),
};

export { Logger } from "./logger";

export { makeNodes, makePrimitiveNodes } from "./make_nodes";

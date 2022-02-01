import {
  IncorrectArgsError,
  makeCallableLibEntryNode,
  NodeType,
} from "../../src";

export const def = makeCallableLibEntryNode(
  "def",
  (interpreter, context, ...args) => {
    if (args.length !== 2) {
      throw new IncorrectArgsError(
        `def expecting 2 args. Received ${args.length}`
      );
    }

    const identifier = args[0];

    if (identifier.type !== NodeType.IDENTIFIER) {
      throw new IncorrectArgsError(`defvar expecting first arg to be a symbol`);
    }

    const targetNode = interpreter.eval(args[1], context);

    context.setLocal(identifier.value, targetNode);

    return identifier;
  }
);

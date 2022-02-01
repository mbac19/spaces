import { makeCallableLibEntryNode } from "../../src";
import { makeQuoteNode } from "../make_nodes/quote";

export const quote = makeCallableLibEntryNode(
  "quote",
  (_interpreter, _context, ...args) => {
    return makeQuoteNode(args);
  }
);

export const evaluate = makeCallableLibEntryNode(
  "eval",
  (interpreter, context, ...args) => {
    throw Error("NOT YET IMPLEMENTED");
  }
);

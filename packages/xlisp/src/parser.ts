import { Node } from "./node";

/**
 * The parser converts raw source code into a list of nodes which can
 * be run by the interpreter.
 */
export interface IParser<TSource> {
  parse(source: TSource): Array<Node>;
}

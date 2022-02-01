import * as Types from "../types";

import { inject, injectable } from "inversify";
import { IParser } from "../parser";
import { MakeNodes, Node, NodeType, SELF_NODE } from "../node";
import { Primitive } from "../primitives";
import { Source, SourceIterator } from "./source";
import { SyntaxError } from "../errors";
import { undefinedThrows } from "@levr/error_utils";

@injectable()
export class Parser implements IParser<Source> {
  constructor(
    @inject(Types.MakeNodes)
    private readonly makeNodes: MakeNodes
  ) {}

  public parse(source: Source): Array<Node> {
    const iter = source.iter();

    const nodes: Array<Node> = [];

    while (!iter.isDone) {
      const node = this.parenthesize(iter);
      undefinedThrows(node);
      nodes.push(node);
    }

    if (nodes.length === 0) {
      throw new SyntaxError("Empty input");
    }

    return nodes;
  }

  private parenthesize(iterator: SourceIterator): Node | undefined {
    let next = iterator.next();

    if (next.done) {
      return;
    }

    if (next.value === ")") {
      throw new SyntaxError(`Unexpected token: )`);
    }

    if (next.value !== "(") {
      return this.categorize(next.value);
    }

    const acc: Array<Node> = [];

    while ((next = iterator.peek())) {
      if (next.done) {
        throw new SyntaxError(`Unexpected end of input`);
      }

      if (next.value === ")") {
        // Reached the end of the list being processed by this element in
        // the hierarchy.
        iterator.shift();
        break;
      }

      if (next.value === "(") {
        // Found a nested list. Need to make a recursive call.
        const result = this.parenthesize(iterator);
        undefinedThrows(result, "Internal Parser Error");
        acc.push(result);
        continue;
      }

      const node = this.categorize(next.value);
      acc.push(node);
      iterator.shift();
    }

    if (acc.length === 0) {
      // No elements in the list.
      return this.makeNodes.Primitive[Primitive.VOID](undefined);
    }

    return { type: NodeType.LIST, value: acc };
  }

  private categorize(token: string): Node {
    if (token === "true" || token === "false") {
      return this.makeNodes.Primitive[Primitive.BOOLEAN](token === "true");
    }

    if (token === "self") {
      return SELF_NODE;
    }

    if (token.startsWith(":")) {
      return this.makeNodes.Key(token.slice(1));
    }

    const float = parseFloat(token);

    // TODO: Would like to improve number processing. May be cases where non
    // numbers are mistaken as numbers with parseFloat. There may also be other
    // cases where we want to consider things as numbers (i.e. scientific
    // notation or the format 1_234_566)
    if (!Number.isNaN(float)) {
      return this.makeNodes.Primitive[Primitive.NUMBER](float);
    }

    if (token.charAt(0) === '"' && token.charAt(token.length - 1) === '"') {
      return this.makeNodes.Primitive[Primitive.STRING](token.slice(1, -1));
    }

    return { type: NodeType.IDENTIFIER, value: token };
  }
}

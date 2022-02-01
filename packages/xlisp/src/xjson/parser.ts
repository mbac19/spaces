import { IParser } from "../parser";
import { Node } from "../node";
import { Source } from "./source";

export class Parser implements IParser<Source> {
  public parse(source: Source): Array<Node> {
    return [source];
  }
}

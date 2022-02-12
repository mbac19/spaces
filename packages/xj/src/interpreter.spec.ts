import * as Types from "./types";

import { Container } from "inversify";
import { Interpreter } from "./interpreter";
import { Number, String } from "./ast";
import { performBind } from "./inversify.config";

describe("interpreter", () => {
  let interpreter: Interpreter;

  beforeAll(() => {
    const container = new Container({ defaultScope: "Singleton" });
    performBind(container);
    interpreter = container.get<Interpreter>(Types.Interpreter);
  });

  test("number self-evaluates", () => {
    expect(interpreter.eval(Number(1))).toEqual(Number(1));
  });

  test("string self-evaluates", () => {
    expect(interpreter.eval(String("hello"))).toEqual(String("hello"));
  });
});

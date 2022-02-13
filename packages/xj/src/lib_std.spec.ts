import * as Types from "./types";

import { Add, Number } from "./interface";
import { Container } from "inversify";
import { Context } from "./context";
import { Interpreter } from "./interpreter";
import { performBind } from "./inversify.config";

describe("lib_std", () => {
  let baseContext: Context;
  let interpreter: Interpreter;

  beforeAll(() => {
    const container = new Container({ defaultScope: "Singleton" });
    performBind(container);
    interpreter = container.get<Interpreter>(Types.Interpreter);
  });

  beforeEach(() => {
    baseContext = new Context({});
  });

  describe("add", () => {
    test("adds 2 numbers", () => {
      const program = Add(Number(100), Number(200));
      expect(interpreter.eval(baseContext, program)).toEqual(Number(300));
    });

    test("adds many numbers", () => {
      const program = Add(Number(1), Number(200), Number(123));
      expect(interpreter.eval(baseContext, program)).toEqual(Number(324));
    });
  });
});

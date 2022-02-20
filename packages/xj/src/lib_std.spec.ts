import * as Types from "./types";

import { Add, Count, First, Number, Range, Void } from "./interface";
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

  describe("range", () => {
    test("query if a number is within a range", () => {
      throw Error("need to defined 'in' operation with collections");
    });

    test("query first element of range", () => {
      const program1 = First(Range(100));
      const program2 = First(Range(50, 70));
      expect(interpreter.eval(baseContext, program1)).toEqual(Number(0));
      expect(interpreter.eval(baseContext, program2)).toEqual(Number(50));
    });

    test("query first element of empty range", () => {
      const program1 = First(Range(0));
      expect(interpreter.eval(baseContext, program1)).toEqual(Void());
    });

    test("query count of range", () => {
      const program1 = Count(Range(0));
      expect(interpreter.eval(baseContext, program1)).toEqual(Number(0));

      const program2 = Count(Range(50));
      expect(interpreter.eval(baseContext, program2)).toEqual(Number(50));

      const program3 = Count(Range(30, 50));
      expect(interpreter.eval(baseContext, program3)).toEqual(Number(20));
    });
  });

  describe("list", () => {});
});

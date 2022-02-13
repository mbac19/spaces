import * as Types from "./types";

import { Boolean, Efrl, Define, Number, String, Symb } from "./interface";
import { Container } from "inversify";
import { Interpreter } from "./interpreter";
import { performBind } from "./inversify.config";
import { Context } from "./context";

describe("interpreter", () => {
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

  test("boolean self-evaluates", () => {
    const program = Boolean(false);
    expect(interpreter.eval(baseContext, program)).toEqual(Boolean(false));
  });

  test("number self-evaluates", () => {
    expect(interpreter.eval(baseContext, Number(1))).toEqual(Number(1));
  });

  test("string self-evaluates", () => {
    let program = String("hello");
    expect(interpreter.eval(baseContext, program)).toEqual(String("hello"));
  });

  describe("define", () => {
    test("returns asigned symbol", () => {
      const program = Define("x", Number(12));
      expect(interpreter.eval(baseContext, program)).toEqual(Symb("x"));
    });

    test("resolves symbols that have been assigned", () => {
      const program = Efrl(Define("x", Number(100)), Symb("x"));
      expect(interpreter.eval(baseContext, program)).toEqual(Number(100));
    });

    test("throws when trying to reference something that does not exist", () => {
      const program = Symb("x");
      expect(() => interpreter.eval(baseContext, program)).toThrow();
    });
  });

  describe("efrl", () => {
    test("empty form throws error", () => {
      expect(() => interpreter.eval(baseContext, Efrl())).toThrow();
    });

    test("returns last evaluation of form", () => {
      const program = Efrl(Number(100), String("hello world"), Number(42));
      expect(interpreter.eval(baseContext, program)).toEqual(Number(42));
    });
  });

  describe("lib_core", () => {
    describe("add", () => {
      test("adds 2 numbers", () => {});
    });
  });
});

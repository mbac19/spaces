import * as Types from "./types";

import {
  Boolean,
  Call,
  Efrl,
  Define,
  Lambda,
  Number,
  String,
  Symb,
  Void,
} from "./interface";
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
    const program = String("hello");
    expect(interpreter.eval(baseContext, program)).toEqual(String("hello"));
  });

  test("lambda self-evaluates", () => {
    const program = Call(Lambda());
    expect(interpreter.eval(baseContext, program)).toEqual(Void());
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
    test("empty form returns void", () => {
      expect(interpreter.eval(baseContext, Efrl())).toEqual(Void());
    });

    test("returns last evaluation of form", () => {
      const program = Efrl(Number(100), String("hello world"), Number(42));
      expect(interpreter.eval(baseContext, program)).toEqual(Number(42));
    });
  });

  describe("calling", () => {
    test("calling empty lambda evaluates to void", () => {
      const program = Call(Lambda());
      expect(interpreter.eval(baseContext, program)).toEqual(Void());
    });

    test("calling lambda evaluates last statement", () => {
      const program = Call(Lambda(Number(100)));
      expect(interpreter.eval(baseContext, program)).toEqual(Number(100));
    });

    test("calling lambda with parameter", () => {
    });
  });

  describe("lib_core", () => {
    describe("add", () => {
      test("adds 2 numbers", () => {});
    });
  });
});

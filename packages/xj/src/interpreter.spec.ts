import * as Types from "./types";

import {
  Add,
  Boolean,
  Call,
  Efrl,
  Define,
  Lambda,
  Number,
  Param,
  String,
  Symb,
  Void,
  SystemRef,
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

  test("system ref self-evaluates", () => {
    const program = SystemRef("foo.bar");
    expect(interpreter.eval(baseContext, program)).toEqual(
      SystemRef("foo.bar")
    );
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

  describe("lambda", () => {
    test("calling empty lambda evaluates to void", () => {
      const program = Call(Lambda());
      expect(interpreter.eval(baseContext, program)).toEqual(Void());
    });

    test("calling lambda evaluates last statement", () => {
      const program = Call(Lambda(Number(100)));
      expect(interpreter.eval(baseContext, program)).toEqual(Number(100));
    });

    test("calling lambda referenced by symbol", () => {
      const program = Efrl(Define("fn", Lambda(Number(100))), Call(Symb("fn")));
    });

    test("calling lambda referenced as param", () => {
      const program = Efrl(
        Call(Lambda(Call(Param(0))), Lambda(String("hello world")))
      );

      expect(interpreter.eval(baseContext, program)).toEqual(
        String("hello world")
      );
    });

    test("calling lambda with parameter by index", () => {
      const program = Call(Lambda(Param(0)), Number(200));
      expect(interpreter.eval(baseContext, program)).toEqual(Number(200));
    });

    test("throws when trying to acquire parameter outside of callable", () => {
      const program = Param(0);
      expect(() => interpreter.eval(baseContext, program)).toThrow();
    });
  });

  describe("system_ref", () => {
    test("throws when calling a system function that does not exist", () => {
      const program = Call(SystemRef("foo.bar"));
      expect(() => interpreter.eval(baseContext, program)).toThrow();
    });
  });

  describe("lib_core", () => {
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
});

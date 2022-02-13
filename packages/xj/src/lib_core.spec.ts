import * as Types from "./types";

import {
  Boolean,
  Call,
  Efrl,
  Efrm,
  Export,
  Define,
  Lambda,
  Module,
  Number,
  Param,
  String,
  Symb,
  Void,
  SystemRef,
  Not,
} from "./interface";
import { ASTNodeType } from "./ast";
import { Container } from "inversify";
import { Context } from "./context";
import { Interpreter } from "./interpreter";
import { performBind } from "./inversify.config";

describe("lib_core", () => {
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

  test("module self-evaluates", () => {
    const program = Module({});
    expect(interpreter.eval(baseContext, program)).toEqual(program);
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

  describe("logical", () => {
    test("logical not inverts boolean", () => {
      const program = Not(Boolean(true));
      expect(interpreter.eval(baseContext, program)).toEqual(Boolean(false));
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

  describe("imports and exports", () => {
    test("exporting from non-module throws error", () => {
      const program = Export("x", Number(100));
      expect(() => interpreter.eval(baseContext, program)).toThrow();
    });
  });

  describe("efrm", () => {
    test("empty form returns empty module", () => {
      const program = Efrm();
      const evaled = interpreter.eval(baseContext, program);
      expect(evaled.type).toBe(ASTNodeType.MODULE);
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
});

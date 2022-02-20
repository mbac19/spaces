import * as Types from "./types";

import {
  Boolean,
  Call,
  Efrl,
  Efrm,
  Export,
  Define,
  Import,
  Lambda,
  Match,
  Module,
  Number,
  Param,
  String,
  Symb,
  Void,
  Not,
  And,
  Or,
  FatalError,
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

  test("throwing fatal errors", () => {
    expect(() => interpreter.eval(baseContext, FatalError())).toThrow();
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

    test("throws when trying to define a variable containing dots", () => {
      const program = Define("x.y", Number(100));
      expect(() => interpreter.eval(baseContext, program)).toThrow();
    });

    test("throws when trying to define a variable starting with a number", () => {
      const program = Define("123hello", String("hello"));
      expect(() => interpreter.eval(baseContext, program)).toThrow();
    });

    test("throws when trying to define a variable starting with a dash", () => {
      const program = Define("-foo", Boolean(false));
      expect(() => interpreter.eval(baseContext, program)).toThrow();
    });

    test("throws when trying to define an empty variable name", () => {
      const program = Define("", Boolean(true));
      expect(() => interpreter.eval(baseContext, program)).toThrow();
    });

    test("throws when trying to define a variable with spaces", () => {
      const program = Define("foo bar", Number(12));
      expect(() => interpreter.eval(baseContext, program)).toThrow();
    });

    test("variables defined later shador earlier variables", () => {
      const program = Efrl(
        Define("x", Number(100)),
        Define("x", String("hello")),
        Symb("x")
      );

      expect(interpreter.eval(baseContext, program)).toEqual(String("hello"));
    });

    test("variables defined in inner scope shadow outter scope variables", () => {
      const program = Efrl(
        Define("y", Number(12)),
        Efrl(Define("y", Number(42)), Symb("y"))
      );

      expect(interpreter.eval(baseContext, program)).toEqual(Number(42));
    });

    test("variables in inner scope go out of scope when form is done", () => {
      const program = Efrl(
        Define("y", Number(12)),
        Efrl(Define("y", Number(42)), Symb("y")),
        Symb("y")
      );

      expect(interpreter.eval(baseContext, program)).toEqual(Number(12));
    });
  });

  describe("logical", () => {
    test("logical not inverts boolean", () => {
      expect(interpreter.eval(baseContext, Not(Boolean(true)))).toEqual(
        Boolean(false)
      );

      expect(interpreter.eval(baseContext, Not(Boolean(false)))).toEqual(
        Boolean(true)
      );
    });

    test("logical not sets truthy values to false", () => {
      const program = Not(Module({}));
      expect(interpreter.eval(baseContext, program)).toEqual(Boolean(false));
    });

    test("logical not sets falsy values to true", () => {
      const program = Not(Void());
      expect(interpreter.eval(baseContext, program)).toEqual(Boolean(true));
    });

    test("logical and multiple boolean values", () => {
      const table = [
        {
          input: And(Boolean(false), Boolean(false)),
          expected: Boolean(false),
        },
        {
          input: And(Boolean(true), Boolean(false)),
          expected: Boolean(false),
        },
        {
          input: And(Boolean(false), Boolean(true)),
          expected: Boolean(false),
        },
        {
          input: And(Boolean(true), Boolean(true)),
          expected: Boolean(true),
        },
      ];

      for (const { input, expected } of table) {
        expect(interpreter.eval(baseContext, input)).toEqual(expected);
      }
    });

    test("logical and returns first falsy argument", () => {
      expect(
        interpreter.eval(baseContext, And(Module({}), Void(), Boolean(false)))
      ).toEqual(Void());
    });

    test("logical and returns last argument if all truthy", () => {
      expect(
        interpreter.eval(
          baseContext,
          And(Module({}), Boolean(true), Number(100))
        )
      ).toEqual(Number(100));
    });

    test("logical and does not evaluate arguments after first falsy", () => {
      expect(() =>
        interpreter.eval(baseContext, And(Boolean(false), FatalError()))
      ).not.toThrow();
    });

    test("logical or boolean values", () => {
      const table = [
        {
          input: Or(Boolean(false), Boolean(false)),
          expected: Boolean(false),
        },
        {
          input: Or(Boolean(true), Boolean(false)),
          expected: Boolean(true),
        },
        {
          input: Or(Boolean(false), Boolean(true)),
          expected: Boolean(true),
        },
        {
          input: Or(Boolean(true), Boolean(true)),
          expected: Boolean(true),
        },
      ];

      for (const { input, expected } of table) {
        expect(interpreter.eval(baseContext, input)).toEqual(expected);
      }
    });

    test("logical or returns first truthy argument", () => {
      expect(
        interpreter.eval(baseContext, Or(Number(100), Boolean(true)))
      ).toEqual(Number(100));
    });

    test("logical or returns last falsy argument if all falsy", () => {
      expect(
        interpreter.eval(baseContext, Or(Boolean(false), Number(0)))
      ).toEqual(Number(0));
    });

    test("logical or does not eval arguments after first truthy argument", () => {
      expect(() =>
        interpreter.eval(baseContext, Or(Number(100), FatalError()))
      ).not.toThrow();
    });
  });

  describe("match", () => {
    test("single case matcher", () => {
      const program = Efrl(
        Define("x", Number(100)),
        Match([Boolean(true), String("Always matches")])
      );

      expect(interpreter.eval(baseContext, program)).toEqual(
        String("Always matches")
      );
    });

    test("matcher matches first matching predicate", () => {
      const program = Efrl(
        Match(
          [Boolean(true), String("Match 1")],
          [Boolean(true), String("Match 2")]
        )
      );

      expect(interpreter.eval(baseContext, program)).toEqual(String("Match 1"));
    });

    test("matcher only evaluates matching cases", () => {
      const program = Efrl(
        Match(
          [Boolean(true), String("Match")],
          [Boolean(true), FatalError("Unexpected error")]
        )
      );

      expect(() => interpreter.eval(baseContext, program)).not.toThrow();
    });

    test("matcher does not evaluate predicates that are not tested", () => {
      const program = Efrl(
        Match(
          [Boolean(true), String("foo")],
          [FatalError("Unexpected Error"), Void()]
        )
      );

      expect(() => interpreter.eval(baseContext, program)).not.toThrow();
    });

    test("matcher throws error if there is no match", () => {
      const program = Efrl(
        Match([Boolean(false), String("foo")], [Boolean(false), Void()])
      );

      expect(() => interpreter.eval(baseContext, program)).toThrow();
    });

    test("matcher matches truthy predicates", () => {
      const program = Match(
        [Void(), String("DO NOT MATCH")],
        [Number(100), String("MATCH")]
      );

      expect(interpreter.eval(baseContext, program)).toEqual(String("MATCH"));
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

    test("importing std module", () => {
      const program = Import("std");

      expect(interpreter.eval(baseContext, program).type).toBe(
        ASTNodeType.MODULE
      );
    });
  });

  describe("efrm", () => {
    test("empty form returns empty module", () => {
      const program = Efrm();
      const evaled = interpreter.eval(baseContext, program);
      expect(evaled).toEqual(Module({}));
    });

    test("makes module with property", () => {
      const program = Efrm(Export("foo", Number(100)));
      const evaled = interpreter.eval(baseContext, program);
      const expected = Module({ foo: Number(100) });
      expect(evaled).toEqual(expected);
    });

    test("export returns a symbol to the set export", () => {
      throw Error(
        "Need to implement conditionals before I can properly test this"
      );
    });

    test("reference a property from within a module using dot notation", () => {
      const program = Efrl(
        Define("foo", Efrm(Export("bar", Number(100)))),
        Symb("foo.bar")
      );

      expect(interpreter.eval(baseContext, program)).toEqual(Number(100));
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

    test("calling lambda with multiple params", () => {
      const program = Call(
        Lambda(And(Param(0), Param(1))),
        Boolean(true),
        Boolean(false)
      );

      expect(interpreter.eval(baseContext, program)).toEqual(Boolean(false));
    });

    test("throws when trying to acquire parameter outside of callable", () => {
      const program = Param(0);
      expect(() => interpreter.eval(baseContext, program)).toThrow();
    });
  });

  describe("loops", () => {
    test("loop through a sequence", () => {
      throw Error(
        "Need conditionals before I can properly implement a finite sequence"
      );
      const program = Module({ __iter__: Lambda(Param(0)) });
    });
  });
});

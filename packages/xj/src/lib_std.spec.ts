import * as Types from "./types";

import {
  Add,
  Boolean,
  Count,
  Equals,
  FatalError,
  First,
  In,
  List,
  Number,
  Range,
  String,
  Void,
} from "./interface";
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

  describe("equals", () => {
    test("checks if 2 numbers are equal", () => {
      const p1 = Equals(Number(100), Number(100));
      expect(interpreter.eval(baseContext, p1)).toEqual(Boolean(true));

      const p2 = Equals(Number(100), Number(40));
      expect(interpreter.eval(baseContext, p2)).toEqual(Boolean(false));
    });

    test("checks if 2 strings are equal", () => {
      const p1 = Equals(String("hello"), String("world"));
      expect(interpreter.eval(baseContext, p1)).toEqual(Boolean(false));

      const p2 = Equals(String("foo"), String("foo"));
      expect(interpreter.eval(baseContext, p2)).toEqual(Boolean(true));
    });
  });

  describe("range", () => {
    test("query if a number is within a range", () => {
      const program1 = In(Number(0), Range(100));
      expect(interpreter.eval(baseContext, program1)).toEqual(Boolean(true));

      const program2 = In(Number(-10), Range(100));
      expect(interpreter.eval(baseContext, program2)).toEqual(Boolean(false));

      const program3 = In(Number(100), Range(100));
      expect(interpreter.eval(baseContext, program3)).toEqual(Boolean(false));

      const program4 = In(Number(75), Range(50, 100));
      expect(interpreter.eval(baseContext, program4)).toEqual(Boolean(true));
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

    test("query first element that meets criteria", () => {
      throw Error("NEED MORE BOOLEAN OPERATORS");
    });

    test("query count of finite range", () => {
      const program1 = Count(Range(0));
      expect(interpreter.eval(baseContext, program1)).toEqual(Number(0));

      const program2 = Count(Range(50));
      expect(interpreter.eval(baseContext, program2)).toEqual(Number(50));

      const program3 = Count(Range(30, 50));
      expect(interpreter.eval(baseContext, program3)).toEqual(Number(20));
    });

    test("query count of infinite range", () => {
      const program1 = Count(Range(Infinity));
      expect(interpreter.eval(baseContext, program1)).toEqual(Number(Infinity));

      const program2 = Count(Range(30, Infinity));
      expect(interpreter.eval(baseContext, program2)).toEqual(Number(Infinity));
    });
  });

  describe("list", () => {
    test("count list", () => {
      const program1 = Count(List(Number(1), Number(2), Number(3)));
      expect(interpreter.eval(baseContext, program1)).toEqual(Number(3));

      const program2 = Count(List());
      expect(interpreter.eval(baseContext, program2)).toEqual(Number(0));
    });

    test("lazy eval list elements", () => {
      const program1 = List(FatalError("Foo"));
      expect(() => interpreter.eval(baseContext, program1)).not.toThrow();
    });

    test("first does not eval elements outside of first element", () => {
      const program1 = First(List(Number(100), FatalError("FOO")));
      expect(interpreter.eval(baseContext, program1)).toEqual(Number(100));
    });

    test("check if element is in list", () => {
      const program1 = In(Number(100), List(Number(400)));
      expect(interpreter.eval(baseContext, program1)).toEqual(Boolean(false));

      const program2 = In(Number(200), List(Number(100), Number(200)));
      expect(interpreter.eval(baseContext, program2)).toEqual(Boolean(true));
    });
  });
});

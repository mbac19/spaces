import { mapError } from "./error_mapper";

describe("error mapper", () => {
  class ErrorA extends Error {}

  class ErrorB extends Error {}

  class ErrorC extends Error {}

  test("maps errors to new types", () => {
    const error1 = new ErrorA("Foo");
    const mapper = mapError([{ From: ErrorA, To: ErrorB }]);
    expect(mapper(error1)).toEqual(new ErrorB("Foo"));
  });

  test("maps errors with custom mappings", () => {
    const error1 = new ErrorA("Foo");

    const mapper = mapError([
      { From: ErrorA, With: (error) => new ErrorC(error.message) },
    ]);

    expect(mapper(error1)).toEqual(new ErrorC("Foo"));
  });

  test("maps from an error using a matcher", () => {
    const error1 = new ErrorA("Foo1");
    const error2 = new ErrorA("Foo2");

    const mapper = mapError([
      { FromMatch: (e) => e.message === "Foo1", To: ErrorB },
    ]);

    expect(mapper(error1)).toEqual(new ErrorB("Foo1"));
    expect(mapper(error2)).toBe(error2);
  });

  test("maps original error if mapping could not be found", () => {
    const error1 = new ErrorA("Bar");
    const mapper = mapError([{ From: ErrorB, To: ErrorC }]);
    expect(mapper(error1)).toBe(error1);
  });
});

import { Source } from "./source";

describe("source", () => {
  test("source is empty", () => {
    const source = new Source("");
    expect(Array.from(source)).toEqual([]);
  });

  test("source is only whitespace", () => {
    const source = new Source("   ");
    expect(Array.from(source)).toEqual([]);
  });

  test("source ignores lines with comments", () => {
    const source = new Source(";; Hello World");
    expect(Array.from(source)).toEqual([]);
  });

  test("source ignores portion of line after a comment", () => {
    const source = new Source("(+ 1 2) ;; Here is a comment");
    expect(Array.from(source)).toEqual(["(", "+", "1", "2", ")"]);
  });

  test("source ignores multiple lines with comments", () => {
    const source = new Source(`
        ;; Here is line 1 with a comment
        ;; Here is another line with a comment
      `);
    expect(Array.from(source)).toEqual([]);
  });

  test("source honors comments inside quotes", () => {
    const source = new Source(`
      "Hello World ;; this is a comment inside a quote"
    `);

    expect(Array.from(source)).toEqual([
      `"Hello World ;; this is a comment inside a quote"`,
    ]);
  });

  test("commented out code is ignored", () => {
    const source = new Source(`
      ;; (print "Hello world, this code is commented out")
    `);

    expect(Array.from(source)).toEqual([]);
  });

  test("quotes are maintained in the tokens", () => {
    const source = new Source(`
      "Hello World"
    `);

    expect(Array.from(source)).toEqual([`"Hello World"`]);
  });
});

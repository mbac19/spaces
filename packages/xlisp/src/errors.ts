export class IncorrectArgsError extends Error {
  public readonly errorType: string = "IncorrectArgsError";

  static quantityMismatch(def: {
    // TODO: Rename to identifier
    symbol: string;
    expecting: number;
    actual: number;
  }) {
    const { actual, expecting, symbol } = def;

    const args = expecting === 1 ? "arg" : "args";

    return new IncorrectArgsError(
      `${symbol} expecting ${expecting} ${args}. Received ${actual}`
    );
  }

  constructor(errorMessage: string) {
    super(`Incorrect Args Error: ${errorMessage}`);
  }
}

export class ParsingError extends Error {
  public readonly errorType: string = "ParsingError";

  constructor(errorMessage: string) {
    super(`Parsing Error: ${errorMessage}`);
  }
}

export class KeyError extends Error {
  public readonly errorType: string = "KeyError";

  constructor(errorMessage: string) {
    super(`Key Error: ${errorMessage}`);
  }
}

export class RuntimeError extends Error {
  public readonly errorType: string = "RuntimeError";

  constructor(errorMessage: string) {
    super(`Runtime Error: ${errorMessage}`);
  }
}

export class SyntaxError extends Error {
  public readonly errorType: string = "SyntaxError";
}

export class TypeError extends Error {
  public readonly errorType: string = "TypeError";

  static unexpectedType(def: { expected: string; actual: string }): TypeError {
    return new TypeError(
      `Expected type ${def.expected}. Actual: ${def.actual}`
    );
  }

  constructor(errorMessage: string) {
    super(`Type Error: ${errorMessage}`);
  }
}

export class ModuleSearchError extends Error {
  public readonly errorType: string = "ModuleError";

  constructor(errorMessage: string) {
    super(`Module Error: ${errorMessage}`);
  }
}

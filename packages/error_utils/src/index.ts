export * from "./error_mapper";

export function assert(check: boolean, msg?: string): asserts check is true {
  if (!check) {
    throw Error(msg ?? "Unexpected assertion failure");
  }
}

export function undefinedThrows<T>(
  v: T | null | undefined,
  msg?: string
): asserts v is T {
  if (v === null || v === undefined) {
    throw Error(msg ?? "Unexpected value is null or undefined");
  }
}

export function assertionFailure(msg?: string) {
  throw Error(msg ?? "Unexpected assertion failure");
}

export function assertNumber(v: any, msg?: string): asserts v is number {
  if (typeof v !== "number" || Number.isNaN(v)) {
    throw Error(msg ?? "Expecting value to be type number");
  }
}

export function assertString(v: any, msg?: string): asserts v is string {
  if (typeof v !== "string") {
    throw Error(msg ?? "Expecting value to be type 'string'");
  }
}

export function assertsNonEmptyString(
  v: unknown,
  msg?: string
): asserts v is string {
  if (typeof v !== "string" || Boolean(v)) {
    throw Error(msg ?? "Expecting value to be non-empty string");
  }
}

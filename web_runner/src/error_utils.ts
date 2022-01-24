export function assert(val: any, msg?: string) {
  if (!Boolean(val)) {
    throw Error(msg ?? "Assertion failure");
  }
}

export function assertIsDefined<T>(
  val: T | undefined | null,
  msg?: string
): asserts val is T {
  if (val === undefined || val === null) {
    throw Error(msg ?? "Expecting val to be defined");
  }
}

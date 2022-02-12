export interface ErrorClass {
  new (message?: string): Error;
}

export interface ErrorMapDirect {
  From: ErrorClass;
  To: ErrorClass;
}

export type ErrorMapFrom =
  | { From: ErrorClass }
  | { FromMatch: (error: Error) => boolean };

export type ErrorMapTo = { To: ErrorClass } | { With: (error: Error) => Error };

export type ErrorMap = ErrorMapFrom & ErrorMapTo;

export type ErrorMaps = Array<ErrorMap>;

export function mapError(mapper: ErrorMaps): (error: Error) => Error {
  return (error: Error) => {
    for (const mapping of mapper) {
      if (isMatch(mapping, error)) {
        return performMap(mapping, error);
      }
    }

    return error;
  };
}

export function mapThenThrowError(
  mapper: Array<{ From: typeof Error; To: typeof Error }>
): (error: Error) => never {
  throw mapError(mapper);
}

export function isMatch(map: ErrorMap, error: Error): boolean {
  if ("From" in map) {
    return error instanceof map.From;
  } else if ("FromMatch" in map) {
    return map.FromMatch(error);
  }
  return false;
}

export function performMap(map: ErrorMap, error: Error): Error {
  if ("To" in map) {
    return new map.To(error.message);
  } else if ("With" in map) {
    return map.With(error);
  }
  return error;
}

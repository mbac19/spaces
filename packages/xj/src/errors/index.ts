/**
 * This is thrown when trying to call a node that is not callable.
 */
export class InvalidCallError extends Error {}

/**
 * Thrown when attempting an invalid variable definition.
 */
export class InvalidDefinitionError extends Error {}

/**
 *
 */
export class IncorrectArguments extends Error {}

/**
 * This is thrown when the program is flawed semantically.
 */
export class MalformedProgramError extends Error {}

/**
 * Thrown when searching for a module that cannot be found.
 */
export class ModuleNotFoundError extends Error {}

/**
 * Thrown when there is a typing error in the program.
 */
export class TypeConstraintError extends Error {}

/**
 * This is called when trying to reference something that does not exist,
 * such as a symbol.
 */
export class UnresolvedReferenceError extends Error {}

/**
 * This is thrown when trying to call a system-defined operation that does
 * not exist.
 */
export class UnresolvedSystemCall extends Error {}

/**
 * Throws when the arguments provided to a function are invalid.
 */
export class InvalidArguments extends Error {}

/**
 * Throws when there is a fatal error.
 */
export class RuntimeFatalError extends Error {}

export function assertProgram(flag: unknown, msg?: string) {
  if (!flag) {
    throw new MalformedProgramError(msg ?? "Assertion failed");
  }
}

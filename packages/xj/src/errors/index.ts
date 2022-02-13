/**
 * This is thrown when trying to call a node that is not callable.
 */
export class InvalidCallError extends Error {}

/**
 * This is thrown when the program is flawed semantically.
 */
export class MalformedProgramError extends Error {}

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

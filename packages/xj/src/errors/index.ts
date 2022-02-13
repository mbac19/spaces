/**
 * This is thrown when the program is flawed semantically.
 */
export class MalformedProgramError extends Error {}

/**
 * This is called when trying to reference something that does not exist,
 * such as a symbol.
 */
export class UnresolvedReferenceError extends Error {}

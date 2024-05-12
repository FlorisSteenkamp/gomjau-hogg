/**
 * Memoize (by reference on the input parameter) the given arity 1 function.
 *
 * * the input parameter must be an `object` (so it can be used as a key to
 * `WeakMap` and thus garbage collected later)
 */
declare function memoize<T extends object, U>(f: (a: T) => U): (a: T) => U;
export { memoize };

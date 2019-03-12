export interface ErrorConstructor {
	new (message?: string): Error;
}

export type Predicate =
	| ErrorConstructor
	| ReadonlyArray<ErrorConstructor>
	| boolean
	| ((error: Error) => boolean | PromiseLike<boolean>);

/**
 * Conditional promise catch handler.
 *
 * @param predicate - Specify either an `Error` constructor, array of `Error` constructors, `boolean`, or function that returns a promise for a `boolean` or a `boolean`. If the function returns a promise, it's awaited.
 * @param catchHandler - Called if `predicate` passes. This is what you would normally pass to `.catch()`.
 * @returns A [thunk](https://en.m.wikipedia.org/wiki/Thunk) that returns a `Promise`.
 */
export default function pCatchIf<T>(
	predicate: Predicate,
	catchHandler: (error: Error) => T
): (error: Error) => T;

export type ErrorConstructor = new (message?: string) => Error;

export type Predicate =
	| ErrorConstructor
	| readonly ErrorConstructor[]
	| boolean
	| ((error: Error) => boolean | PromiseLike<boolean>);

/**
Conditional promise catch handler.

@param predicate - Specify either an `Error` constructor, array of `Error` constructors, `boolean`, or function that returns a promise for a `boolean` or a `boolean`. If the function returns a promise, it's awaited.
@param catchHandler - Called if `predicate` passes. This is what you would normally pass to `.catch()`.
@returns A [thunk](https://en.wikipedia.org/wiki/Thunk) that returns a `Promise`.

@example
```
import pCatchIf from 'p-catch-if';

// Error constructor
getData().catch(pCatchIf(TimeoutError, () => retry(getData)));

// Multiple error constructors
getData().catch(pCatchIf([NetworkError, TimeoutError], () => retry(getData)));

// Boolean
getData().catch(pCatchIf(isProduction, error => recordError(error)));

// Function
const hasUnicornMessage = error => error.message.includes('unicorn');
getData().catch(pCatchIf(hasUnicornMessage, console.error));

// Promise-returning function
const handler = error => sendError(error).then(checkResults);
getData().catch(pCatchIf(handler, console.error));

// Can also be nested
const validateMessage = error => error.message === 'Too many rainbows';
getData().catch(pCatchIf(UnicornError, pCatchIf(validateMessage, console.error)));
```
*/
export default function pCatchIf<T>(predicate: Predicate, catchHandler: (error: Error) => T): (error: Error) => T;

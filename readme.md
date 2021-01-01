# p-catch-if

> Conditional promise catch handler

Useful for handling only some types of errors and let the rest pass through.


## Install

```
$ npm install p-catch-if
```


## Usage

```js
const pCatchIf = require('p-catch-if');

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


## API

### pCatchIf(predicate, catchHandler)

Returns a [thunk](https://en.wikipedia.org/wiki/Thunk) that returns a `Promise`.

#### predicate

Type: `Error.constructor` `Error.constructor[]` `boolean` `Function -> Promise<boolean>|boolean`

Specify either an error constructor, array of error constructors, boolean, or function that returns a promise for a boolean or a boolean.

If the function returns a promise, it's awaited.

#### catchHandler

Type: `Function`

Called if `predicate` passes.

This is what you would normally pass to `.catch()`.


## Related

- [p-if](https://github.com/sindresorhus/p-if) - Conditional promise chains
- [p-tap](https://github.com/sindresorhus/p-tap) - Tap into a promise chain without affecting its value or state
- [p-log](https://github.com/sindresorhus/p-log) - Log the value/error of a promise
- [More…](https://github.com/sindresorhus/promise-fun)


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)

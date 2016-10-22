'use strict';
const isErrorConstructor = require('is-error-constructor');

module.exports = (predicate, fn) => err => {
	if (typeof fn !== 'function') {
		throw new TypeError('Expected a catch handler');
	}

	if (typeof predicate === 'boolean') {
		if (predicate === true) {
			return fn(err);
		}
	} else if (Array.isArray(predicate) || isErrorConstructor(predicate)) {
		if ([].concat(predicate).some(x => err instanceof x)) {
			return fn(err);
		}
	} else if (typeof predicate === 'function') {
		return Promise.resolve(err)
			.then(predicate)
			.then(val => val ? fn() : Promise.reject(err));
	}

	throw err;
};

'use strict';

const isErrorConstructor = require('is-error-constructor');

const pCatchIf = (predicate, catchHandler) => error => {
	if (typeof catchHandler !== 'function') {
		throw new TypeError('Expected a catch handler');
	}

	if (predicate === true) {
		return catchHandler(error);
	}

	if (Array.isArray(predicate) || isErrorConstructor(predicate)) {
		if ([]
			.concat(predicate)
			.some(errorConstructor => error instanceof errorConstructor)) {
			return catchHandler(error);
		}
	} else if (typeof predicate === 'function') {
		return (async () => {
			const value = await predicate(error);
			if (value === true) {
				return catchHandler(error);
			}

			throw error;
		})();
	}

	throw error;
};

module.exports = pCatchIf;
// TODO: Remove this for the next major release
module.exports.default = pCatchIf;

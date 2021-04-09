import isErrorConstructor from 'is-error-constructor';

export default function pCatchIf(predicate, catchHandler) {
	return error => {
		if (typeof catchHandler !== 'function') {
			throw new TypeError('Expected a catch handler');
		}

		if (predicate === true) {
			return catchHandler(error);
		}

		if (Array.isArray(predicate) || isErrorConstructor(predicate)) {
			if ([predicate].flat().some(errorConstructor => error instanceof errorConstructor)) {
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
}

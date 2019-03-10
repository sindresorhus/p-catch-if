import {expectType} from 'tsd-check';
import pCatchIf from '.';

class MyError extends Error {}

// Predicate is an ErrorConstructor
expectType<(error: MyError) => string>(
	pCatchIf(MyError, error => {
		expectType<MyError>(error);
		return 'foo';
	})
);

// Predicate is an ErrorConstructor[]
expectType<(error: MyError) => string>(
	pCatchIf([MyError, Error], error => {
		expectType<Error>(error);
		return 'foo';
	})
);

// Predicate is a boolean
expectType<(error: MyError) => string>(
	pCatchIf(true, error => {
		expectType<Error>(error);
		return 'foo';
	})
);

// Predicate is a function returning a boolean
expectType<(error: MyError) => string>(
	pCatchIf(
		error => {
			expectType<Error>(error);
			return true;
		},
		error => {
			expectType<Error>(error);
			return 'foo';
		}
	)
);

// Predicate is a function returning a Promise<boolean>
expectType<(error: MyError) => string>(
	pCatchIf(
		error => {
			expectType<Error>(error);
			return Promise.resolve(true);
		},
		error => {
			expectType<Error>(error);
			return 'foo';
		}
	)
);

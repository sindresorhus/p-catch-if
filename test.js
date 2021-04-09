import test from 'ava';
import pCatchIf from './index.js';

const fixture = Symbol('fixture');
const fixtureError = new Error('fixture');
const fixtureRangeError = new RangeError('fixture-range');

test('predicate is true', async t => {
	const result = await Promise.reject(fixtureError)
		.catch(pCatchIf(true, () => fixture));

	t.is(result, fixture);
});

test('predicate is false', async t => {
	const result = await Promise.reject(fixtureError)
		.catch(pCatchIf(false, () => fixture))
		.catch(error => error);

	t.is(result, fixtureError);
});

test('predicate is error constructor and matches error', async t => {
	const result = await Promise.reject(fixtureRangeError)
		.catch(pCatchIf(RangeError, () => fixture));

	t.is(result, fixture);
});

test('predicate is error constructor and does not match error', async t => {
	const result = await Promise.reject(fixtureError)
		.catch(pCatchIf(RangeError, () => fixture))
		.catch(error => error);

	t.is(result, fixtureError);
});

test('predicate is array of error constructors and matches error', async t => {
	const result = await Promise.reject(fixtureRangeError)
		.catch(pCatchIf([ReferenceError, RangeError], () => fixture));

	t.is(result, fixture);
});

test('predicate is array of error constructors and does not match error', async t => {
	const result = await Promise.reject(fixtureError)
		.catch(pCatchIf([ReferenceError, RangeError], () => fixture))
		.catch(error => error);

	t.is(result, fixtureError);
});

test('predicate function returns true', async t => {
	const result = await Promise.reject(fixtureError)
		.catch(pCatchIf(() => true, () => fixture));

	t.is(result, fixture);
});

test('predicate function that returns true should pass error to catch handler', async t => {
	const result = await Promise.reject(fixtureError)
		.catch(pCatchIf(() => true, error => error));

	t.is(result, fixtureError);
});

test('predicate function returns false', async t => {
	const result = await Promise.reject(fixtureError)
		.catch(pCatchIf(() => false, () => fixture))
		.catch(error => error);

	t.is(result, fixtureError);
});

test('predicate function returns promise that resolves to true', async t => {
	const result = await Promise.reject(fixtureError)
		.catch(pCatchIf(async () => true, () => fixture));

	t.is(result, fixture);
});

test('predicate function returns promise that resolves to false', async t => {
	const result = await Promise.reject(fixtureError)
		.catch(pCatchIf(async () => false, () => fixture))
		.catch(error => error);

	t.is(result, fixtureError);
});

test('predicate function returns promise that resolves to truthy', async t => {
	const result = await Promise.reject(fixtureError)
		.catch(pCatchIf(async () => 1, () => fixture))
		.catch(error => error);

	t.is(result, fixtureError);
});

test('catch handler is required', async t => {
	await t.throwsAsync(Promise.reject(fixtureError).catch(pCatchIf(true)));
});

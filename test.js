import test from 'ava';
import m from './';

const fixture = Symbol('fixture');
const fixtureErr = new Error('fixture');
const fixtureRangeErr = new RangeError('fixture-range');

test('predicate is true', async t => {
	const result = await Promise.reject(fixtureErr)
		.catch(m(true, () => fixture));

	t.is(result, fixture);
});

test('predicate is false', async t => {
	const result = await Promise.reject(fixtureErr)
		.catch(m(false, () => fixture))
		.catch(err => err);

	t.is(result, fixtureErr);
});

test('predicate is error constructor and matches error', async t => {
	const result = await Promise.reject(fixtureRangeErr)
		.catch(m(RangeError, () => fixture));

	t.is(result, fixture);
});

test('predicate is error constructor and does not match error', async t => {
	const result = await Promise.reject(fixtureErr)
		.catch(m(RangeError, () => fixture))
		.catch(err => err);

	t.is(result, fixtureErr);
});

test('predicate is array of error constructors and matches error', async t => {
	const result = await Promise.reject(fixtureRangeErr)
		.catch(m([ReferenceError, RangeError], () => fixture));

	t.is(result, fixture);
});

test('predicate is array of error constructors and does not match error', async t => {
	const result = await Promise.reject(fixtureErr)
		.catch(m([ReferenceError, RangeError], () => fixture))
		.catch(err => err);

	t.is(result, fixtureErr);
});

test('predicate function returns true', async t => {
	const result = await Promise.reject(fixtureErr)
		.catch(m(() => true, () => fixture));

	t.is(result, fixture);
});

test('predicate function returns false', async t => {
	const result = await Promise.reject(fixtureErr)
		.catch(m(() => false, () => fixture))
		.catch(err => err);

	t.is(result, fixtureErr);
});

test('predicate function returns promise that resolves to true', async t => {
	const result = await Promise.reject(fixtureErr)
		.catch(m(async () => true, () => fixture));

	t.is(result, fixture);
});

test('predicate function returns promise that resolves to false', async t => {
	const result = await Promise.reject(fixtureErr)
		.catch(m(async () => false, () => fixture))
		.catch(err => err);

	t.is(result, fixtureErr);
});

test('predicate function returns promise that resolves to truthy', async t => {
	const result = await Promise.reject(fixtureErr)
		.catch(m(async () => 1, () => fixture))
		.catch(err => err);

	t.is(result, fixtureErr);
});

test('catch handler is required', async t => {
	await t.throws(Promise.reject(fixtureErr).catch(m(true)));
});

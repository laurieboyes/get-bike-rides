import 'babel-polyfill'
import { expect } from 'chai';
import numberArrayFuzzyFindIndex from '../../src/util/number-array-fuzzy-find-index';

describe('numberArrayFuzzyFindIndex', () => {
	it('return the array index of the closest number to that which is given', () => {
		const theArray = [3,8,30,60];
		const theNumber = 16;
		expect(numberArrayFuzzyFindIndex(theArray, theNumber)).to.equal(1);
	});
});
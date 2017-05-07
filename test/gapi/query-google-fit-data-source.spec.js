import 'babel-polyfill'
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import getNanos from '../../src/util/get-nanos'

const dataSourceId = 'some:fake.data_source:id';
const fromDate = new Date(0);
const toDate = new Date('1989-07-09');

// IRL it's 100k
const maxGapiResults = 3;

let queryGoogleFitDataSource;
const makeGapiRequestMock = sinon.stub();

describe.only('queryGoogleFitDataSource', () => {

	beforeEach(() => {
		queryGoogleFitDataSource = proxyquire('../../src/gapi/query-google-fit-data-source', {
			'./make-gapi-request': { default: makeGapiRequestMock },
			'./max-gapi-results': { default: maxGapiResults }
		}).default;
	});

	beforeEach(() => {
		makeGapiRequestMock.resetHistory();
	});

	it('should return query the Google API and return an array of points', () => {
		makeGapiRequestMock.returns(Promise.resolve([{ a: 1 }, { b: 2 }]));
		return queryGoogleFitDataSource(dataSourceId, fromDate, toDate)
			.then(points => {
				expect(points).to.deep.equal([{ a: 1 }, { b: 2 }]);
			});
	});

	it('should should stay cool when gapi returns nothing', () => {
		makeGapiRequestMock.returns(Promise.resolve([]));
		return queryGoogleFitDataSource(dataSourceId, fromDate, toDate)
			.then(points => {
				expect(points).to.deep.equal([]);
			});
	});

	it('should make more requests for the previous batch if the number of results was equal to the max gapi results, and return them in chronological order', () => {

		makeGapiRequestMock.withArgs(sinon.match(/\.*-615945600000000000$/)).returns(Promise.resolve([{ f: 6, startTimeNanos: 1468022400000000000 }, { g: 7 }, { h: 8 }]));
		makeGapiRequestMock.withArgs(sinon.match(/\.*-1468022399999000000$/)).returns(Promise.resolve([{ c: 3, startTimeNanos: 1436400000000000000 }, { d: 4 }, { e: 5 }]));
		makeGapiRequestMock.withArgs(sinon.match(/\.*-1436399999999000000$/)).returns(Promise.resolve([{ a: 1 }, { b: 2 }]));

		return queryGoogleFitDataSource(dataSourceId, fromDate, toDate)
			.then(points => {
				// note that this isn't what points look like really, and each would have a startTimeNanos (and loads of other stuff)
				expect(points).to.deep.equal([
					{ a: 1 },
					{ b: 2 },
					{ c: 3, startTimeNanos: 1436400000000000000 },
					{ d: 4 },
					{ e: 5 },
					{ f: 6, startTimeNanos: 1468022400000000000 },
					{ g: 7 },
					{ h: 8 }
				]);
			});
	});
});
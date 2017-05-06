import 'babel-polyfill'
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

const dataSourceId = 'some:fake.data_source:id';
const fromDate = new Date(0);
const toDate = new Date();

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
		makeGapiRequestMock.onCall(0).returns(Promise.resolve([{ f: 6, startTimeNanos: 123 }, { g: 7 }, { h: 8 }]));
		makeGapiRequestMock.onCall(1).returns(Promise.resolve([{ c: 3, startTimeNanos: 456 }, { d: 4 }, { e: 5 }]));
		makeGapiRequestMock.onCall(2).returns(Promise.resolve([{ a: 1 }, { b: 2 }]));

		return queryGoogleFitDataSource(dataSourceId, fromDate, toDate)
			.then(points => {
				expect(points).to.deep.equal([
					{ a: 1 },
					{ b: 2 },
					{ c: 3, startTimeNanos: 456 },
					{ d: 4 },
					{ e: 5 },
					{ f: 6, startTimeNanos: 123 },
					{ g: 7 },
					{ h: 8 }
				]);
			});
	});
});
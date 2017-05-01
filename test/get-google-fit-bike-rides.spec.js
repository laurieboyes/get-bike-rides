import 'babel-polyfill'
import { expect } from 'chai';
import proxyquire from 'proxyquire';

let getGoogleFitBikeRides;

describe('getGoogleFitBikeRides', () => {

	beforeEach(() => {

		const fixtures = {
			gapiActivity: require('./fixtures/gapi-activity'),
			gapiLocation: require('./fixtures/gapi-location')
		};

		const queryFitnessDataSourceStub = dataSourceId => {
			if (dataSourceId.includes('activity')) {
				return Promise.resolve(fixtures.gapiActivity);
			} else if (dataSourceId.includes('location')) {
				return Promise.resolve(fixtures.gapiLocation);
			} else {
				return Promise.resolve([]);
			}
		}

		getGoogleFitBikeRides = proxyquire('../src/get-google-fit-bike-rides', {
			'./gapi/queries': { queryFitnessDataSource: queryFitnessDataSourceStub }
		}).default;

	});

	it('should massage the google fit data into a nice list of bike rides', () => {
		return getGoogleFitBikeRides(new Date(), new Date())
			.then(bikeRides => {
				expect(bikeRides).to.deep.equal(
					[
						{
							startTime: new Date('2016-02-19T08:55:19.278Z'),
							endTime: new Date('2016-02-19T09:20:37.294Z'),
							startLatLang: {
								lat: 51.44794845581055,
								lng: -0.11469300091266632
							},
							endLatLang: {
								lat: 51.495140075683594,
								lng: -0.10170780122280121
							},
							durationMs: 1518016
						},
						{
							startTime: new Date('2016-02-21T16:14:44.275Z'),
							endTime: new Date('2016-02-21T16:24:12.909Z'),
							startLatLang: {
								lat: 51.44852066040039,
								lng: -0.0774001032114029
							},
							endLatLang: {
								lat: 51.4498405456543,
								lng: -0.09957139939069748
							},
							durationMs: 568633.999872
						}
					]
				);
			});
	});
});

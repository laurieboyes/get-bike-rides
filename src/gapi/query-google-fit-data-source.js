import getNanos from '../util/get-nanos';
import makeGapiRequest from './make-gapi-request';
import maxGapiResults from './max-gapi-results';

function getDateFromNanos (nanos) {
	return new Date(nanos / 1000000);
}

function lessThanADayApart (dateA, dateB) {
	return dateA.getTime() - dateB.getTime() < 86400000;
}

export default function queryFitnessDataSource (dataSourceId, fromDate, toDate) {
	const path = `fitness/v1/users/me/dataSources/${dataSourceId}/datasets/${getNanos(fromDate)}-${getNanos(toDate)}`;
	return makeGapiRequest(path)
		.then(points => {
			if (points.length < maxGapiResults) {
				return points;
			} else {
				const earliestDateInPoints = getDateFromNanos(points[0].startTimeNanos);
				const newToDate = new Date(earliestDateInPoints.getTime() - 1);
				console.log(`Loads of results. Querying again to get points before ${earliestDateInPoints.toDateString()}`);
				return queryFitnessDataSource(dataSourceId, fromDate, newToDate)
					.then(prevBatchOfPoints => prevBatchOfPoints.concat(points));
			}
		})

}

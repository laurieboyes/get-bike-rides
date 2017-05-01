import getNanos from '../util/get-nanos';

function doTheActualQuery (dataSourceId, fromDate, toDate) {
	const path = `fitness/v1/users/me/dataSources/${dataSourceId}/datasets/${getNanos(fromDate)}-${getNanos(toDate)}`;
	return gapi.client.request({ path })
		.then(({ result: { point } }) => point)
}

function getDateFromNanos (nanos) {
	return new Date(nanos / 1000000);
}

function lessThanADayApart (dateA, dateB) {
	return dateA.getTime() - dateB.getTime() < 86400000;
}

export function queryFitnessDataSource (dataSourceId, fromDate, toDate) {
	return doTheActualQuery(dataSourceId, fromDate, toDate)
		.then(points => {

			if (points.length === 0) {
				return []
			}

			else if (lessThanADayApart(getDateFromNanos(points[0].startTimeNanos), fromDate)) {
				return points;
			}

			else {
				const earliestDateInPoints = getDateFromNanos(points[0].startTimeNanos);
				const newToDate = new Date(earliestDateInPoints.getTime() - 1);
				console.log(`Loads of results. Querying again to get points before ${earliestDateInPoints.toDateString()}`);
				return queryFitnessDataSource(dataSourceId, fromDate, newToDate)
					.then(prevBatchOfPoints => prevBatchOfPoints.concat(points));
			}
		})

}

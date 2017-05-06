export default path => gapi.client.request({ path })
	.then(({ result: { point } }) => point);
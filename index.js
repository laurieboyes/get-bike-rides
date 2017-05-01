import getGoogleFitBikeRides from './src/get-google-fit-bike-rides';
import _googleApiScope from './src/google-api-scope';

window.getGoogleFitBikeRides = getGoogleFitBikeRides
window.getGoogleFitBikeRides.googleApiScope = googleApiScope;

export default getGoogleFitBikeRides;
export const googleApiScope = _googleApiScope;
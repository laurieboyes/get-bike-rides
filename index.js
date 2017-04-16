import getGoogleFitBikeRides from './src/get-google-fit-bike-rides';
import googleApiScope from './src/google-api-scope';

window.getGoogleFitBikeRides = getGoogleFitBikeRides
window.getGoogleFitBikeRides.googleApiScope = googleApiScope;

export const googleApiScope;
export default getGoogleFitBikeRides;
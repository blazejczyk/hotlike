import { Services } from '@tomtom-international/web-sdk-services';

/**
 * This is a "wrapper" of TomTom SDK for NodeJS usage. The reason of it is the fact that TomTom SDK doesn't connect
 * typings for NodeJS implementation inside the package.
 *
 * The main JS file of the package and its corresponding typings are dedicated for web apps only. This causes an import
 * error in case of using the module directly (as the web apis are used "under the hood").
 */
const { services: tomtom }: { services: Services } = require('@tomtom-international/web-sdk-services/dist/services-node.min');

export default tomtom;

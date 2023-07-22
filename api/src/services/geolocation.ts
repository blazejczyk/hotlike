import { Client as GoogleClient, TravelMode } from '@googlemaps/google-maps-services-js';
import polylineApi from '@mapbox/polyline';
import * as turf from '@turf/turf';
import { groupBy, keyBy } from 'lodash';

import tomtomApi from '../libs/tomtom';
import config from '../core/config';
import { getHash } from './utils';
import { getTomtomPoiCategories } from '../repos/caches';
import { Activity } from '../db/schemas/enums';

const googleApi = new GoogleClient();

type TCoordinate = {
  latitude: string;
  longitude: string;
};

type TPlace = {
  sourceId: string;
  name: string;
  activity: Activity;
  coordinate: TCoordinate;
};

export function blurCoordinate({ latitude, longitude }: TCoordinate, radius: number): TCoordinate {
  const { geometry: { coordinates: [blurredLongitude, blurredLatitude] } } = turf.destination(
    turf.point([Number(longitude), Number(latitude)]),
    Math.random() * radius,
    Math.random() * 360,
    { units: 'meters' },
  );
  return {
    latitude: blurredLatitude.toString(),
    longitude: blurredLongitude.toString(),
  };
}

/**
 * WARNING: This is a valuable (can be paid) request. Use carefully and cache the results when it's possible.
 */
export async function getPolyline(fromCoordinate: TCoordinate, toCoordinate: TCoordinate): Promise<TCoordinate[]> {
  const { data } = await googleApi.directions({
    params: {
      origin: [fromCoordinate.latitude, fromCoordinate.longitude].join(','),
      destination: [toCoordinate.latitude, toCoordinate.longitude].join(','),
      mode: TravelMode.walking,
      key: config.apis.google.key,
    },
  });
  const encodedPolyline = data.routes[0].overview_polyline.points;
  const decodedPolyline = polylineApi.decode(encodedPolyline);
  return decodedPolyline.map(([latitude, longitude]) => ({ latitude: latitude.toString(), longitude: longitude.toString() }));
}

/**
 * WARNING: This is a valuable (can be paid) request. Use carefully and cache the results when it's possible.
 */
export async function importPlaces({ latitude, longitude }: TCoordinate, radius: number, limit: number, activities: string[]): Promise<TPlace[]> {
  const poiCategories = await getTomtomPoiCategories();
  const poiCategoriesByActivity = groupBy(poiCategories, 'activity');
  const wantedPoiCategories = activities.flatMap((activity) => activity in poiCategoriesByActivity ? poiCategoriesByActivity[activity] : []);
  const wantedPoiParentCategoriesIds = wantedPoiCategories.filter(({ parentId }) => !parentId).map(({ id }) => id);
  const { results } = await tomtomApi.nearbySearch({
    key: config.apis.tomtom.key,
    center: { lat: Number(latitude), lng: Number(longitude) },
    radius: radius,
    limit: limit,
    categorySet: wantedPoiParentCategoriesIds.join(','),
  });
  if (!results) {
    return [];
  }
  const wantedPoiCategoriesIdsSet = new Set(wantedPoiCategories.map(({ id }) => id));
  const poiCategoriesById = keyBy(poiCategories, 'id');
  return results.reduce<TPlace[]>((importedPlaces, result) => {
    const { id, poi, position } = result;
    if (!(id && poi && poi.name && poi.categorySet && position && position.lat && position.lng)) {
      return importedPlaces;
    }
    const category = poi.categorySet
      .find((c) => c.id && wantedPoiCategoriesIdsSet.has(c.id.toString())); // this causes the function has actually the O(n^2) computational complexity but not a big deal here as the given datasets are usually very small
    if (!(category && category.id && category.id in poiCategoriesById)) {
      return importedPlaces;
    }
    importedPlaces.push({
      sourceId: getHash(id, config.salt),
      name: poi.name,
      activity: poiCategoriesById[category.id].activity,
      coordinate: {
        latitude: position.lat.toString(),
        longitude: position.lng.toString(),
      },
    });
    return importedPlaces;
  }, []);
}

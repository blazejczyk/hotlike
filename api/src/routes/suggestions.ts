import { intersection, keyBy, random, pick, orderBy } from 'lodash';

import { route } from '../core/request';
import { getNearbyUsers, getUser } from '../repos/users';
import { getNearbyPlaces, getPlacesBySourcesIds, createPlaces } from '../repos/places';
import { getDefaultPhotos } from '../repos/photos';
import { arePlacesImported, createPlacesImport } from '../repos/caches';
import { usersConstants, placesConstants, cachesConstants } from '../services/constants';
import { importPlaces } from '../services/geolocation';
import { User, Place, Photo } from '../db/schemas/models';
import { Activity, Gender } from '../db/schemas/enums';
import { NotFoundError } from '../core/errors';
import { getAge } from '../services/utils';
import { getCompatibility } from '../services/matching';
import config from '../core/config';

type TNormalizedSuggestion = {
  user: {
    id: string;
    name: string;
    gender: Gender;
    age: number;
    compatibility: number;
    defaultPhoto: {
      thumbnailUrl: string;
    };
  };
  place: {
    id: string;
    name: string;
    activity: Activity;
    coordinate: {
      latitude: string;
      longitude: string;
    };
  };
};

export default [
  route<TNormalizedSuggestion[]>({
    method: 'get',
    path: '/suggestions',
    restricted: true,
    callback: async ({ session: { userId } }) => {
      const user = await getUser(userId);
      if (!user) {
        throw new NotFoundError('User does not exist.');
      }

      const nearbyUsers = await getNearbyUsers(userId, usersConstants.searchRadius, usersConstants.searchLimit);
      if (!nearbyUsers.length) {
        // no nearby users so can't provide any suggestion
        return normalizeSuggestions([], [], user, {});
      }

      const nearbyUsersIds = nearbyUsers.map(({ id }) => id);
      const defaultPhotos = await getDefaultPhotos(nearbyUsersIds);
      const defaultPhotosByUserId = keyBy(defaultPhotos, 'userId');

      // try to find nearby places in database
      const nearbyPlaces = await getNearbyPlaces(userId, placesConstants.searchRadius, placesConstants.searchLimit);
      if (nearbyPlaces.length === placesConstants.searchLimit) { // todo: + when the data is not fresh enough
        // places from db seem to be a good enough result, no need to import
        return normalizeSuggestions(nearbyUsers, nearbyPlaces, user, defaultPhotosByUserId);
      }

      // check the last import for given area
      if (await arePlacesImported(user.latitude, user.longitude, cachesConstants.placesImportRadius, cachesConstants.placesImportMaxDays)) {
        // it means that places have been imported and cached recently in this area so there's no need to import them again
        return normalizeSuggestions(nearbyUsers, nearbyPlaces, user, defaultPhotosByUserId);
      }

      const commonActivities = intersection(user.activities, nearbyUsers.flatMap(({ activities }) => activities));
      const importedPlaces = await importPlaces({ latitude: user.latitude, longitude: user.longitude }, placesConstants.searchRadius, placesConstants.searchLimit, commonActivities);
      await createPlacesImport(user.latitude, user.longitude); // prevent next unnecessary imports for given area
      // todo: transaction (?)
      if (!importedPlaces.length) {
        return normalizeSuggestions(nearbyUsers, nearbyPlaces, user, defaultPhotosByUserId);
      }
      const sourcesIds = importedPlaces.map(({ sourceId }) => sourceId);
      const existingSourcesIdsSet = new Set((await getPlacesBySourcesIds(sourcesIds)).map(({ sourceId }) => sourceId));
      const placesData = importedPlaces
        .filter(({ sourceId }) => !existingSourcesIdsSet.has(sourceId))
        .map(({ sourceId, name, activity, coordinate: { latitude, longitude } }) => ({ sourceId, name, activity, latitude, longitude }));
      const createdPlaces = await createPlaces(placesData);
      return normalizeSuggestions(nearbyUsers, [...nearbyPlaces, ...createdPlaces].slice(0, placesConstants.searchLimit), user, defaultPhotosByUserId);
    }
  }),
];

function normalizeSuggestions(suggestedUsers: User[], suggestedPlaces: Place[], user: User, defaultPhotosByUserId: Record<string, Photo>): TNormalizedSuggestion[] {
  if (!suggestedPlaces) {
    return [];
  }
  const suggestedPlacesByActivity = keyBy(suggestedPlaces, 'activity');
  const normalizedSuggestions = suggestedUsers.reduce<TNormalizedSuggestion[]>((suggestions, suggestedUser) => {
    const commonActivities = intersection(suggestedUser.activities, user.activities);
    if (!commonActivities.length) { // this should actually never happen by design however just in case of any bug it's covered here
      return suggestions;
    }
    const commonActivity = commonActivities[random(0, commonActivities.length - 1)];
    const suggestedPlace = suggestedPlacesByActivity[commonActivity];
    if (!suggestedPlace) { // just like above in case of `commonActivities` this should never happen by design however it's covered
      return suggestions;
    }
    if (!(suggestedUser.id in defaultPhotosByUserId)) { // the same as above, every user should have a default photo
      return suggestions;
    }
    const defaultPhoto = defaultPhotosByUserId[suggestedUser.id];
    suggestions.push({
      user: {
        ...pick(suggestedUser, ['id', 'name', 'gender']),
        age: getAge(new Date(suggestedUser.dateOfBirth)),
        compatibility: getCompatibility(user, suggestedUser),
        defaultPhoto: {
          thumbnailUrl: config.photo.thumbnail.url(defaultPhoto.id),
        },
      },
      place: {
        ...pick(suggestedPlace, ['id', 'name', 'activity']),
        coordinate: {
          latitude: suggestedPlace.latitude,
          longitude: suggestedPlace.longitude,
        },
      },
    });
    return suggestions;
  }, []);
  return orderBy(normalizedSuggestions, ({ user: { compatibility } }) => compatibility, 'desc');
}

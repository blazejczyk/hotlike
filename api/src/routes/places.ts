import { param } from 'express-validator';

import { route } from '../core/request';
import { getPlace } from '../repos/places';
import { Place } from '../db/schemas/models';
import { isPlaceId } from '../services/validators';
import { NotFoundError } from '../core/errors';

type TNormalizedPlace = {
  id: string;
  name: string;
  activity: string;
  coordinate: {
    latitude: string;
    longitude: string;
  }
};

export default [
  route<TNormalizedPlace, ['placeId']>({
    method: 'get',
    path: '/places/:placeId',
    restricted: true,
    validations: [
      param('placeId')
        .isUUID(4).bail()
        .custom(isPlaceId()),
    ],
    callback: async ({ req: { params } }) => {
      const place = await getPlace(params.placeId);
      if (!place) {
        throw new NotFoundError('Place does not exist.');
      }
      return normalizePlace(place);
    },
  }),
];

function normalizePlace({ id, name, activity, latitude, longitude }: Place): TNormalizedPlace {
  return {
    id, name, activity,
    coordinate: {
      latitude, longitude,
    }
  };
}

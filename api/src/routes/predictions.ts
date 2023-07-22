import { route } from '../core/request';
import { getNearbyUsers, getUser } from '../repos/users';
import { getCompatibility } from '../services/matching';
import { blurCoordinate } from '../services/geolocation';
import { NotFoundError } from '../core/errors';
import { predictionsConstants } from '../services/constants';
import { User } from '../db/schemas/models';
import { getHash } from '../services/utils';

type TNormalizedPrediction = {
  id: string;
  compatibility: number;
  coordinate: {
    latitude: string;
    longitude: string;
  };
};

export default [
  route<TNormalizedPrediction[]>({
    method: 'get',
    path: '/predictions',
    restricted: true,
    callback: async ({ session: { userId } }) => {
      const authedUser = await getUser(userId);
      if (!authedUser) {
        throw new NotFoundError('User does not exist.');
      }
      const predictedUsers = await getNearbyUsers(userId, predictionsConstants.searchRadius, predictionsConstants.searchLimit);
      return predictedUsers.map((predictedUser) => normalizePrediction(predictedUser, authedUser));
    }
  }),
];

function normalizePrediction(predictedUser: User, authedUser: User): TNormalizedPrediction {
  return {
    id: getHash(predictedUser.id),
    compatibility: getCompatibility(predictedUser, authedUser),
    // important note because of privacy:
    // this is not a real person's location, it's intentionally "blurred"
    // (it means: "some interesting person is around, but it's unknown who this person really is and where exactly")
    coordinate: blurCoordinate({
      latitude: predictedUser.latitude,
      longitude: predictedUser.longitude,
    }, predictionsConstants.blurRadius),
  };
}

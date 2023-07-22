import { param } from 'express-validator';
import { pick, orderBy } from 'lodash';

import { route } from '../core/request';
import { User } from '../db/schemas/models';
import { Gender } from '../db/schemas/enums';
import { getUser } from '../repos/users';
import { getCompatibility } from '../services/matching';
import { isUserId } from '../services/validators';
import { NotFoundError } from '../core/errors';
import { getAge } from '../services/utils';
import config from '../core/config';

type TNormalizedUser = {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  photos: {
    id: string;
    width: number;
    height: number;
    isDefault: boolean;
    imageUrl: string;
    thumbnailUrl: string;
  }[];
  compatibility: number;
};

export default [
  route<TNormalizedUser, ['userId']>({
    method: 'get',
    path: '/users/:userId',
    restricted: true,
    validations: [
      param('userId')
        .isUUID(4).bail()
        .custom(isUserId()),
    ],
    callback: async ({ req: { params }, session }) => {
      const [user, authedUser] = await Promise.all([getUser(params.userId), getUser(session.userId)]);
      if (!user) {
        throw new NotFoundError('User does not exist.');
      }
      if (!authedUser) {
        throw new NotFoundError('Authed user does not exist.');
      }
      return normalizeUser(user, authedUser);
    },
  }),
];

function normalizeUser(user: User, authedUser: User): TNormalizedUser {
  return {
    ...pick(user, ['id', 'name', 'gender']),
    age: getAge(new Date(user.dateOfBirth)),
    photos: (orderBy(user.photos, ['isDefault', 'createdAt'], ['desc', 'asc']) || []).map((photo) => ({
      ...pick(photo, ['id', 'width', 'height', 'isDefault']),
      imageUrl: config.photo.image.url(photo.id),
      thumbnailUrl: config.photo.thumbnail.url(photo.id),
    })),
    compatibility: getCompatibility(user, authedUser),
  };
}

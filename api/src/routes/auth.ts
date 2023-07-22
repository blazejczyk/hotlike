import { body } from 'express-validator';
import { pick, orderBy } from 'lodash';
import addSeconds from 'date-fns/addSeconds';
import isAfter from 'date-fns/isAfter';

import { route } from '../core/request';
import { User } from '../db/schemas/models';
import { Activity, Body, Gender, Goal, Personality } from '../db/schemas/enums';
import { getUser, getUserByEmail, createUser, updateUser, deleteUser } from '../repos/users';
import { getHash, generateCode } from '../services/utils';
import { isBody, isGender, isPhoto, isUserEmail, isPassword, areActivities, isPersonality, areGoals, areGenders } from '../services/validators';
import { NotFoundError, BadRequestError, ForbiddenError } from '../core/errors';
import config from '../core/config';
import { usersConstants, photosConstants } from '../services/constants';
import { getToken } from '../services/session';
import { process } from '../services/photos';
import { sendActivationCode } from '../services/mails';

type TNormalizedAuthedUser = {
  id: string;
  email: string;
  name: string;
  gender: Gender;
  dateOfBirth: string;
  height: number;
  body: Body;
  smoking: boolean;
  activities: Activity[];
  personality: Personality;
  goals: Goal[];
  hasKids: boolean;
  preferredGenders: Gender[];
  prefersTaller: boolean;
  prefersShorter: boolean;
  rejectsSmoking: boolean;
  rejectsKids: boolean;
  latitude: string;
  longitude: string;
  disabled: boolean;
  photos: {
    id: string;
    width: number;
    height: number;
    isDefault: boolean;
    imageUrl: string;
    thumbnailUrl: string;
  }[];
};

export default [
  route<{ token: string; }, [], { email: string; password: string; notificationsToken?: string }>({
    method: 'post',
    path: '/auth/login',
    restricted: false,
    validations: [
      body('email')
        .isEmail(),
      body('password')
        .isString(),
      body('notificationsToken')
        .isString()
    ],
    callback: async ({ req: { body } }) => {
      const user = await getUserByEmail(body.email.toLowerCase());
      const notFoundMessage = 'Invalid email & password combination or account not activated.';
      if (!user || (user.activation && !user.authedAt)) { // email could be actually checked by the validator however we want to obscure what's truly incorrect here
        throw new NotFoundError(notFoundMessage);
      }
      const cipher = getHash(body.password, config.salt);
      if (cipher !== user.cipher) {
        throw new NotFoundError(notFoundMessage);
      }
      const authedAt = new Date();
      await updateUser(user.id, { authedAt, notificationsToken: body.notificationsToken });
      return { token: getToken(user.id, authedAt) };
    },
  }),

  route<void>({
    method: 'post',
    path: '/auth/logout',
    restricted: true,
    callback: async ({ session }) => {
      const user = await getUser(session.userId);
      if (!user) {
        throw new NotFoundError('User does not exist.');
      }
      await updateUser(session.userId, { notificationsToken: null });
    },
  }),

  route<void, [], { email: string; }>({
    method: 'post',
    path: '/auth/reset',
    restricted: false,
    validations: [
      body('email')
        .isEmail().bail()
        .custom(isUserEmail(true)),
    ],
    callback: async ({ req: { body } }) => {
      const user = await getUserByEmail(body.email.toLowerCase());
      if (!user) {
        throw new NotFoundError('User does not exist.');
      }
      const activationCode = generateCode();
      await updateUser(user.id, { activation: { code: activationCode, expirationTime: addSeconds(new Date(), usersConstants.activationTime).toISOString() } });
      sendActivationCode(user.email, activationCode);
    },
  }),

  route<void, [], { email: string; code: string; password?: string; }>({
    method: 'post',
    path: '/auth/activation',
    restricted: false,
    validations: [
      body('email')
        .isString().bail()
        .custom(isUserEmail(true)),
      body('code')
        .isString().bail()
        .isLength({ min: 6, max: 6 }),
      body('password')
        .optional()
        .isString().bail()
        .custom(isPassword(usersConstants.minPasswordLength, usersConstants.maxPasswordLength)),
    ],
    callback: async ({ req: { body } }) => {
      const user = await getUserByEmail(body.email.toLowerCase());
      if (!user) {
        throw new NotFoundError('User does not exist.');
      }
      if (!user.activation) {
        throw new ForbiddenError('User has not requested a password reset.');
      }
      if ((body.code !== user.activation.code) || isAfter(new Date(), new Date(user.activation.expirationTime))) {
        throw new BadRequestError('Invalid activation code or operation has expired.');
      }
      await updateUser(user.id, { activation: null, ...(body.password ? { cipher: getHash(body.password, config.salt) } : {}) });
    },
  }),

  route<TNormalizedAuthedUser>({
    method: 'get',
    path: '/auth/user',
    restricted: true,
    callback: async ({ session }) => {
      const user = await getUser(session.userId);
      if (!user) {
        throw new NotFoundError('User does not exist.');
      }
      return normalizeAuthedUser(user);
    },
  }),

  route<
    TNormalizedAuthedUser,
    [],
    {
      name: string;
      gender: Gender;
      dateOfBirth: string;
      height: number;
      body: Body;
      smoking: boolean;
      activities: Activity[];
      personality: Personality;
      goals: Goal[];
      hasKids: boolean;
      preferredGenders: Gender[];
      prefersTaller: boolean;
      prefersShorter: boolean;
      rejectsSmoking: boolean;
      rejectsKids: boolean;
      latitude: string;
      longitude: string;
      photoFile: string;
      email: string;
      password?: string;
      fbToken?: string;
    }
  >({
    method: 'post',
    path: '/auth/user',
    restricted: false,
    validations: [
      body('name')
        .isString().bail()
        .isLength({ min: usersConstants.minNameLength, max: usersConstants.maxNameLength }),
      body('gender')
        .isString().bail()
        .custom(isGender()),
      body('dateOfBirth')
        .isDate({ format: 'YYYY-MM-DD' }),
      body('height')
        .isInt({ min: usersConstants.minHeight, max: usersConstants.maxHeight }),
      body('body')
        .isString().bail()
        .custom(isBody()),
      body('smoking')
        .isBoolean(),
      body('activities')
        .isArray({ min: usersConstants.minActivitiesNumber, max: usersConstants.maxActivitiesNumber }).bail()
        .custom(areActivities()),
      body('personality')
        .isString().bail()
        .custom(isPersonality()),
      body('goals')
        .isArray().bail()
        .custom(areGoals()),
      body('hasKids')
        .isBoolean(),
      body('preferredGenders')
        .isArray().bail()
        .custom(areGenders()),
      body('prefersTaller')
        .isBoolean(),
      body('prefersShorter')
        .isBoolean(),
      body('rejectsSmoking')
        .isBoolean(),
      body('rejectsKids')
        .isBoolean(),
      body('latitude')
        .isNumeric(),
      body('longitude')
        .isNumeric(),
      body('photoFile')
        .isBase64().bail()
        .custom(isPhoto()),
      body('email')
        .isEmail().bail()
        .custom(isUserEmail(false)),
      body('password')
        .optional()
        .isString().bail()
        .custom(isPassword(usersConstants.minPasswordLength, usersConstants.maxPasswordLength)),
      body('fbToken')
        .optional()
        .isString()
    ],
    callback: async ({ req: { body } }) => {
      if (!body.password && !body.fbToken) {
        throw new BadRequestError('The "password" or "fbToken" must be provided.');
      }
      const cipher = body.password
        ? getHash(body.password, config.salt)
        : ''; // todo: prepare cipher basing on facebook data
      const [imageBuffer, thumbnailBuffer] = await process(body.photoFile);
      const activationCode = generateCode();
      const activation = { code: activationCode, expirationTime: addSeconds(new Date(), usersConstants.activationTime).toISOString() };
      const createdUser = await createUser(
        body.email, cipher, body.name, body.gender, body.dateOfBirth, body.height, body.body, body.smoking,
        body.activities, body.personality, body.goals, body.hasKids, body.preferredGenders, body.prefersTaller,
        body.prefersShorter, body.rejectsSmoking, body.rejectsKids, body.latitude, body.longitude, activation,
        photosConstants.image.dimension.width, photosConstants.image.dimension.height, imageBuffer, thumbnailBuffer,
      );
      sendActivationCode(createdUser.email, activationCode);
      return normalizeAuthedUser(createdUser);
    },
  }),

  route<
    TNormalizedAuthedUser,
    [],
    {
      height?: number;
      body?: Body;
      smoking?: boolean;
      activities?: Activity[];
      personality?: Personality;
      goals?: Goal[];
      hasKids?: boolean;
      preferredGenders?: Gender[];
      prefersTaller?: boolean;
      prefersShorter?: boolean;
      rejectsSmoking?: boolean;
      rejectKids?: boolean;
      latitude?: string;
      longitude?: string;
      disabled?: boolean;
    }
  >({
    method: 'put',
    path: `/auth/user`,
    restricted: true,
    validations: [
      body('height')
        .optional()
        .isInt({ min: usersConstants.minHeight, max: usersConstants.maxHeight }),
      body('body')
        .optional()
        .isString().bail()
        .custom(isBody()),
      body('smoking')
        .optional()
        .isBoolean(),
      body('activities')
        .optional()
        .isArray({ min: usersConstants.minActivitiesNumber, max: usersConstants.maxActivitiesNumber }).bail()
        .custom(areActivities()),
      body('personality')
        .optional()
        .isString().bail()
        .custom(isPersonality()),
      body('goals')
        .optional()
        .isArray().bail()
        .custom(areGoals()),
      body('hasKids')
        .optional()
        .isBoolean(),
      body('preferredGenders')
        .optional()
        .isArray().bail()
        .custom(areGenders()),
      body('prefersTaller')
        .optional()
        .isBoolean(),
      body('prefersShorter')
        .optional()
        .isBoolean(),
      body('rejectsSmoking')
        .optional()
        .isBoolean(),
      body('rejectsKids')
        .optional()
        .isBoolean(),
      body('latitude')
        .optional()
        .isNumeric(),
      body('longitude')
        .optional()
        .isNumeric(),
      body('disabled')
        .optional()
        .isBoolean(),
    ],
    callback: async ({ session, req: { body } }) => {
      const updatedUser = await updateUser(session.userId, body);
      return normalizeAuthedUser(updatedUser);
    },
  }),

  route<null>({
    method: 'delete',
    path: `/auth/user`,
    restricted: true,
    callback: async ({ session }) => {
      const user = await getUser(session.userId);
      if (!user) {
        throw new NotFoundError('User does not exist.');
      }
      await deleteUser(session.userId);
      return null;
    },
  }),
];

function normalizeAuthedUser(user: User): TNormalizedAuthedUser {
  return {
    ...pick(user, [
      'id', 'email', 'name', 'gender', 'dateOfBirth', 'height', 'body', 'smoking', 'activities', 'personality', 'goals',
      'hasKids', 'preferredGenders', 'prefersTaller', 'prefersShorter', 'rejectsSmoking', 'rejectsKids', 'latitude',
      'longitude', 'disabled',
    ]),
    photos: (orderBy(user.photos, ['isDefault', 'createdAt'], ['desc', 'asc']) || []).map((photo) => ({
      ...pick(photo, ['id', 'width', 'height', 'isDefault']),
      imageUrl: config.photo.image.url(photo.id),
      thumbnailUrl: config.photo.thumbnail.url(photo.id),
    })),
  };
}

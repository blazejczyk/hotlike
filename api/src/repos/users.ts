import db from '../db/db';
import { User, Photo } from '../db/schemas/models';
import { TActivation } from '../db/schemas/app/User';
import { Activity, Body, Gender, Goal, Personality } from '../db/schemas/enums';

/**
 * Find nearby like-minded people for given user.
 *
 * Note: One of the matching condition is based on the "half-your-age-plus-seven" rule for socially acceptable age gap:
 * https://en.wikipedia.org/wiki/Age_disparity_in_sexual_relationships#%22Half-your-age-plus-seven%22_rule
 *
 * @param userId User identifier for whom the matching people should be found.
 * @param radius Radius of the area around the user in meters.
 * @param limit Maximum number of matching people.
 */
export function getNearbyUsers(userId: string, radius: number, limit: number): Promise<User[]> {
  // todo: exclude users that have already been dated (accepted / rejected)
  return db.query(`
    SELECT users.*
    FROM app.users
    JOIN app.users u ON u.id = :userId AND u.deleted_at IS NULL
    LEFT JOIN app.meetings ON (meetings.inviter_user_id = users.id OR meetings.invitee_user_id = users.id) AND meetings.deleted_at IS NULL
    WHERE ST_DistanceSphere(ST_Point(users.longitude, users.latitude), ST_Point(u.longitude, u.latitude)) < :radius
    AND users.gender = ANY(u.preferred_genders) AND u.gender = ANY(users.preferred_genders)
    AND DATE_PART('year', AGE(users.date_of_birth)) BETWEEN DATE_PART('year', AGE(u.date_of_birth)) / 2 + 7 AND (DATE_PART('year', AGE(u.date_of_birth)) - 7) * 2
    AND (
      CASE
        WHEN
          u.prefers_taller AND NOT u.prefers_shorter
          AND (users.prefers_shorter OR users.prefers_taller = users.prefers_shorter)
          THEN users.height > u.height
        WHEN
          u.prefers_shorter AND NOT u.prefers_taller
          AND (users.prefers_taller OR users.prefers_taller = users.prefers_shorter)
          THEN users.height < u.height
        WHEN
          u.prefers_taller = u.prefers_shorter
          AND (
            (users.prefers_taller AND NOT users.prefers_shorter AND u.height > users.height)
            OR (users.prefers_shorter AND NOT users.prefers_taller AND u.height < users.height)
            OR (users.prefers_taller = users.prefers_shorter)
           )
          THEN TRUE
        ELSE FALSE
      END
    )
    AND (
      CASE
        WHEN u.rejects_smoking THEN NOT users.smoking
        ELSE TRUE
      END
    )
    AND users.activities && u.activities
    AND (users.personality = 'ambivert' OR u.personality = 'ambivert' OR users.personality = u.personality)
    AND users.goals && u.goals
    AND (
      CASE
        WHEN u.rejects_kids THEN NOT users.has_kids
        ELSE TRUE
      END
    )
    AND NOT users.disabled
    AND users.id != :userId
    AND users.deleted_at IS NULL
    AND meetings.id IS NULL
    ORDER BY users.updated_at DESC
    LIMIT :limit
  `, {
    model: User,
    mapToModel: true,
    replacements: { userId, radius, limit },
  });
}

export async function areUsersNearby(firstUserId: string, secondUserId: string, radius: number): Promise<boolean> {
  return (await db.query(`
    SELECT users.id
    FROM app.users
    JOIN app.users u ON u.id = :secondUserId AND u.deleted_at IS NULL
    WHERE ST_DistanceSphere(ST_Point(users.longitude, users.latitude), ST_Point(u.longitude, u.latitude)) < :radius
    AND users.id = :firstUserId
    AND users.deleted_at IS NULL
  `, {
    replacements: { firstUserId, secondUserId, radius },
  }))[0].length > 0;
}

export function getUser(userId: string): Promise<User | null> {
  return User.findByPk(userId, {
    include: [Photo],
  });
}

export function getUserByEmail(email: string): Promise<User | null> {
  return User.findOne({
    where: { email },
    include: [Photo]
  })
}

export async function createUser(
  email: string, cipher: string, name: string, gender: Gender, dateOfBirth: string, height: number, body: Body,
  smoking: boolean, activities: Activity[], personality: Personality, goals: Goal[], hasKids: boolean,
  preferredGenders: Gender[], prefersTaller: boolean, prefersShorter: boolean, rejectsSmoking: boolean,
  rejectsKids: boolean, latitude: string, longitude: string, activation: TActivation, imageWidth: number,
  imageHeight: number, image: Buffer, thumbnail: Buffer,
): Promise<User> {
  return await db.transaction(async (transaction) => {
    const user = await User.create({
      email, cipher, name, gender, dateOfBirth, height, body, smoking, activities, personality, goals, hasKids,
      preferredGenders, prefersTaller, prefersShorter, rejectsSmoking, rejectsKids, latitude, longitude, activation,
    }, { transaction });
    await Photo.create({
      userId: user.id, width: imageWidth, height: imageHeight, image, thumbnail, isDefault: true
    }, { transaction });
    return user;
  });
}

export async function updateUser(
  userId: string,
  data: Partial<Pick<User,
    'cipher' | 'email' | 'name' | 'height' | 'body' | 'smoking' | 'activities' | 'personality' | 'goals' | 'hasKids' |
    'preferredGenders' | 'prefersTaller' | 'prefersShorter' | 'rejectsSmoking' | 'rejectsKids' | 'latitude' |
    'longitude' | 'disabled' | 'activation' | 'authedAt' | 'notificationsToken'
  >>
): Promise<User> {
  const user = await User.findByPk(userId, {
    include: [Photo],
  });
  if (!user) {
    throw new Error('User does not exist.');
  }
  return await db.transaction(async (transaction) => {
    if (data.notificationsToken) {
      const notifiedUser = await User.findOne({
        where: {
          notificationsToken: data.notificationsToken
        },
      });
      if (notifiedUser) {
        await notifiedUser.update({ notificationsToken: null }, { transaction });
      }
    }
    await user.update(data, { transaction });
    return user;
  });
}

export async function deleteUser(userId: string): Promise<void> {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User does not exist.');
  }
  await db.transaction(async (transaction) => {
    await Photo.destroy({
      where: { userId },
      transaction,
    });
    await user.destroy({ transaction });
  });
}

import { Op } from 'sequelize';

import db from '../db/db';
import { Place } from '../db/schemas/models';
import { Activity } from '../db/schemas/enums';

export function getNearbyPlaces(userId: string, radius: number, limit: number): Promise<Place[]> {
  return db.query(`
    SELECT places.*
    FROM app.places
    JOIN app.users u ON u.id = :userId AND u.deleted_at IS NULL
    WHERE ST_DistanceSphere(ST_Point(places.longitude, places.latitude), ST_Point(u.longitude, u.latitude)) < :radius
    AND places.activity = ANY(u.activities)
    AND places.deleted_at IS NULL
    ORDER BY places.updated_at DESC
    LIMIT :limit
  `, {
    model: Place,
    mapToModel: true,
    replacements: { userId, radius, limit },
  });
}

export function getPlacesBySourcesIds(sourceIds: string[]) {
  return Place.findAll({
    where: {
      sourceId: {
        [Op.in]: sourceIds,
      },
    },
  });
}

export async function isPlaceNearby(placeId: string, userId: string, radius: number): Promise<boolean> {
  return (await db.query(`
    SELECT places.id
    FROM app.places
    JOIN app.users u ON u.id = :userId AND u.deleted_at IS NULL
    WHERE ST_DistanceSphere(ST_Point(places.longitude, places.latitude), ST_Point(u.longitude, u.latitude)) < :radius
    AND places.id = :placeId
    AND places.deleted_at IS NULL
  `, {
    replacements: { placeId, userId, radius },
  }))[0].length > 0;
}

export function getPlace(placeId: string): Promise<Place | null> {
  return Place.findByPk(placeId);
}

export function createPlaces(data: { sourceId: string, name: string, activity: Activity, latitude: string, longitude: string }[]): Promise<Place[]> {
  return Place.bulkCreate(data);
}

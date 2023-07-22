import db from '../db/db';
import { TomtomPoiCategory, PlacesImport } from '../db/schemas/models';
import { Activity } from '../db/schemas/enums';

export function getTomtomPoiCategories(): Promise<TomtomPoiCategory[]> {
  return TomtomPoiCategory.findAll();
}

export function createTomtomPoiCategories(data: { id: string; parentId: string | null; activity: Activity }[]): Promise<TomtomPoiCategory[]> {
  return TomtomPoiCategory.bulkCreate(data, {
    ignoreDuplicates: true,
  });
}

export async function arePlacesImported(latitude: string, longitude: string, radius: number, maxDays: number): Promise<boolean> {
  return (await db.query(`
    SELECT places_imports.*
    FROM cache.places_imports
    WHERE ST_DistanceSphere(ST_Point(places_imports.longitude, places_imports.latitude), ST_Point(:longitude, :latitude)) < :radius
    AND places_imports.created_at >= (CURRENT_TIMESTAMP - INTERVAL :interval)
    ORDER BY places_imports.created_at DESC
    LIMIT 1
  `, {
    replacements: { latitude, longitude, radius, interval: `${maxDays} DAYS` },
  }))[0].length > 0;
}

export async function createPlacesImport(latitude: string, longitude: string): Promise<PlacesImport> {
  const placesImport = await PlacesImport.create({ latitude, longitude });
  await placesImport.reload();
  return placesImport;
}

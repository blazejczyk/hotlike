import tomtomApi from '../libs/tomtom';
import config from '../core/config';
import { createTomtomPoiCategories } from '../repos/caches';
import { Activity } from '../db/schemas/enums';

// for some reason the PoiCategory type doesn't exist in tomtom API lib
type PoiCategory = {
  id: number;
  name: string;
  childCategoryIds: number[];
  synonyms: string[];
};

export default async function importTomtomPoiCategories() {

  // const [poiCategories, activities] = await Promise.all([getPoiCategories(), getActivities()]);
  const activities = Object.values(Activity);
  const poiCategories = await getPoiCategories();

  const { activityPoiCategoriesIds, poiCategoriesChildrenParentsIds } = activities.reduce<{
    activityPoiCategoriesIds: { [key in Activity]: Set<number> };
    poiCategoriesChildrenParentsIds: Record<number, number>;
  }>((obj, activity) => {
    const { activityPoiCategoriesIds, poiCategoriesChildrenParentsIds } = obj;
    poiCategories.forEach((poiCategory) => {
      if (!(isPoiCategoryActivity(poiCategory.name, activity) || poiCategory.synonyms.some((synonym) => isPoiCategoryActivity(synonym, activity)))) {
        return;
      }
      if (!(activity in activityPoiCategoriesIds)) {
        activityPoiCategoriesIds[activity] = new Set();
      }
      activityPoiCategoriesIds[activity].add(poiCategory.id);
      poiCategory.childCategoryIds.forEach((childCategoryId) => {
        if (!activityPoiCategoriesIds[activity].has(childCategoryId)) {
          activityPoiCategoriesIds[activity].add(childCategoryId);
        }
        poiCategoriesChildrenParentsIds[childCategoryId] = poiCategory.id;
      });
    });
    return obj;
  }, {
    activityPoiCategoriesIds: {} as { [key in Activity]: Set<number> },
    poiCategoriesChildrenParentsIds: {},
  });

  const importedPoiCategoriesData: { id: string; parentId: string | null; activity: Activity }[] = Object.entries(activityPoiCategoriesIds)
    .flatMap(([activityKey, poiCategoriesIds]) => {
      return [...poiCategoriesIds].map((poiCategoryId) => ({
        id: poiCategoryId.toString(),
        parentId: poiCategoryId in poiCategoriesChildrenParentsIds ? poiCategoriesChildrenParentsIds[poiCategoryId].toString() : null,
        activity: activityKey as Activity,
      }));
    });

  const createdPoiCategories = await createTomtomPoiCategories(importedPoiCategoriesData);

  console.log(`${createdPoiCategories.length} have been imported successfully.`);
}

async function getPoiCategories(): Promise<PoiCategory[]> {
  const { poiCategories } = await tomtomApi.poiCategories({
    key: config.apis.tomtom.key,
  });
  return poiCategories;
}

function isPoiCategoryActivity(poiCategoryName: string, activityKey: string): boolean {
  return poiCategoryName
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .includes(activityKey);
}

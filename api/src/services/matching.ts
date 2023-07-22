import { intersection, sum, round } from 'lodash';

import { User } from '../db/schemas/models';
import { Body, Personality } from '../db/schemas/enums';

const initialCompatibility = 1;

const compatibilityWeights = {
  initial: 5,
  personality: 4,
  goals: 3,
  activities: 2,
  body: 1,
};

export function getCompatibility(firstUser: User, secondUser: User): number {
  const allActivities = new Set([...firstUser.activities, ...secondUser.activities]);
  const commonActivities = intersection(firstUser.activities, secondUser.activities);
  const activitiesCompatibility = commonActivities.length / allActivities.size;

  const allGoals = new Set([...firstUser.goals, ...secondUser.goals]);
  const commonGoals = intersection(firstUser.goals, secondUser.goals);
  const goalsCompatibility = commonGoals.length / allGoals.size;

  const personalityCompatibility = getPersonalityCompatibility(firstUser.personality as Personality, secondUser.personality);
  const bodyCompatibility = getBodyCompatibility(firstUser.body as Body, secondUser.body);

  return round(sum([
    initialCompatibility * compatibilityWeights.initial,
    activitiesCompatibility * compatibilityWeights.activities,
    goalsCompatibility * compatibilityWeights.goals,
    personalityCompatibility * compatibilityWeights.personality,
    bodyCompatibility * compatibilityWeights.body,
  ]) / sum(Object.values(compatibilityWeights)), 2);
}

function getPersonalityCompatibility(firstUserPersonality: Personality, secondUserPersonality: Personality): number {
  if (firstUserPersonality === secondUserPersonality) {
    return 1;
  }
  if (firstUserPersonality === Personality.AMBIVERT || secondUserPersonality === Personality.AMBIVERT) {
    return 0.8;
  }
  return 0.6;
}

function getBodyCompatibility(firstUserBody: Body, secondUserBody: Body) {
  if (firstUserBody === secondUserBody) {
    return 1;
  }
  // we're assuming that pairs: 'slim' & 'curvy' and 'athletic' & 'curvy' are less compatible bodies
  const compatibleBodiesPairs = [[Body.SLIM, Body.AVERAGE], [Body.SLIM, Body.ATHLETIC], [Body.AVERAGE, Body.ATHLETIC], [Body.AVERAGE, Body.CURVY]];
  for (const compatibleBodies of compatibleBodiesPairs) {
    const areCompatible =
      (firstUserBody === compatibleBodies[0] && secondUserBody === compatibleBodies[1]) ||
      (firstUserBody === compatibleBodies[1] && secondUserBody === compatibleBodies[0]);
    if (areCompatible) {
      return 0.8;
    }
  }
  return 0.6;
}

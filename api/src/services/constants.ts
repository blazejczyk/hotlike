/**
 * All constants related to the business logic.
 * This SHOULD NOT contain any app configuration settings.
 */

export const predictionsConstants = {
  searchRadius: 5000, // meters
  searchLimit: 30,
  blurRadius: 500, // meters
};

export const usersConstants = {
  searchRadius: 1000, // meters
  searchLimit: 20,
  minNameLength: 1,
  maxNameLength: 30,
  minHeight: 140, // cm
  maxHeight: 220, // cm
  minActivitiesNumber: 1,
  maxActivitiesNumber: 6,
  minPasswordLength: 8,
  maxPasswordLength: 30,
  activationTime: 180, // seconds => 3 minutes
};

export const meetingsConstants = {
  invitationExpirationTime: 90, // seconds
};

export const placesConstants = {
  searchRadius: 500, // meters
  searchLimit: 10,
};

export const photosConstants = {
  minPhotosNumber: 1,
  maxPhotosNumber: 6,
  maxFileSize: 1048576, // 1 MB
  image: {
    dimension: {
      width: 800,
      height: 800,
    },
  },
  thumbnail: {
    dimension: {
      width: 200,
      height: 200,
    },
  },
}

export const messagesConstants = {
  minTextLength: 1,
  maxTextLength: 1000,
};

export const cachesConstants = {
  placesImportRadius: 250, // meters (the area considered as the possible zone having the same places around)
  placesImportMaxDays: 3, // max "age" of import in days
};

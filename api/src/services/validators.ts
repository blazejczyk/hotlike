import sharp from 'sharp';

import { getUser, getUserByEmail } from '../repos/users';
import { getPlace } from '../repos/places';
import { getPhoto } from '../repos/photos';
import { getMessage } from '../repos/messages';
import { includesAll } from './utils';
import { photosConstants } from './constants';
import { Activity, Body, Gender, Goal, Personality } from '../db/schemas/enums';

export function isUserId(options?: { whitelist?: Set<string>, blacklist?: Set<string> }) {
  return async (userId: string) => {
    const user = await getUser(userId);
    if (!user) {
      return Promise.reject(new Error('User does not exist.'));
    }
    if (options?.whitelist && !options.whitelist.has(userId)) {
      return Promise.reject(new Error('User is not on the whitelist.'));
    }
    if (options?.blacklist && options.blacklist.has(userId)) {
      return Promise.reject(new Error('User is on the blacklist.'));
    }
    return Promise.resolve(userId);
  };
}

export function isPlaceId() {
  return async (placeId: string) => {
    const place = await getPlace(placeId);
    if (!place) {
      return Promise.reject(new Error('Place does not exist.'));
    }
    return Promise.resolve(placeId);
  };
}

export function isPhotoId(userId?: string) {
  return async (photoId: string) => {
    const photo = await getPhoto(photoId);
    if (!photo) {
      return Promise.reject(new Error('Photo does not exist.'));
    }
    if (userId && photo.userId !== userId) {
      return Promise.reject(new Error('Photo is restricted for the owner only.'));
    }
    return Promise.resolve(photoId);
  };
}

export function isMessageId(userId?: string) {
  return async (messageId: string) => {
    const message = await getMessage(messageId);
    if (!message) {
      return Promise.reject(new Error('Message does not exist.'));
    }
    if (userId && message.userId !== userId) {
      return Promise.reject(new Error('Message is restricted for the owner only.'));
    }
    return Promise.resolve(messageId);
  };
}

export function isPhoto() {
  const getMetadata = async (buffer: Buffer) => {
    try {
      return await sharp(buffer).metadata();
    } catch (err) {
      return null;
    }
  };
  return async (file: string) => {
    const buffer = Buffer.from(file, 'base64');
    if (buffer.byteLength > photosConstants.maxFileSize) {
      return Promise.reject(new Error(`Maximum file size is: ${photosConstants.maxFileSize} bytes.`));
    }
    const metadata = await getMetadata(buffer);
    if (!metadata) {
      return Promise.reject(new Error('Invalid photo file.'));
    }
    const { width, height } = metadata;
    if (!width || !height) {
      return Promise.reject('Metadata reading failed.');
    }
    if (width !== height) { // the code of handling photos is prepared for a situation when we actually decide to get rid of this condition
      return Promise.reject('Photo dimension must be a square.');
    }
    if (width < photosConstants.image.dimension.width || height < photosConstants.image.dimension.height) {
      return Promise.reject(`Photo dimension must be at least: ${photosConstants.image.dimension.width} x ${photosConstants.image.dimension.height} pixels.`);
    }
    return Promise.resolve(file);
  };
}

// export function isUserEmailAllowed() {
//   return async (email: string) => {
//     const user = await getUserByEmail(email);
//     if (user) {
//       return Promise.reject(new Error('User already exists.'));
//     }
//     return Promise.resolve(email);
//   };
// }

export function isUserEmail(existing: boolean) {
  return async (email: string) => {
    const user = await getUserByEmail(email.toLowerCase());
    if (existing && !user) {
      return Promise.reject(new Error('User does not exist.'));
    }
    if (!existing && user) {
      return Promise.reject(new Error('User already exists.'));
    }
    return Promise.resolve(email);
  };
}

export function isPassword(minLength: number, maxLength: number) {
  return (password: string) => {
    if (password === '') {
      return Promise.reject('Password cannot be empty');
    }
    if (password.length < minLength) {
      return Promise.reject(`Password must be at least ${minLength} characters long.`);
    }
    if (password.length > maxLength) {
      return Promise.reject(`Password must be at most ${maxLength} characters long.`);
    }
    if (!/[A-Z]/.test(password)) {
      return Promise.reject('Password must contain uppercase.');
    }
    if (!/[a-z]/.test(password)) {
      return Promise.reject('Password must contain lowercase.');
    }
    if (!/\d/.test(password)) {
      return Promise.reject('Password must contain numbers.');
    }
    if (!/[!@#$%^&*()]/.test(password)) {
      return Promise.reject('Password must contain special characters.');
    }
    return Promise.resolve(password);
  };
}

export function isBody() {
  return (body: Body) => Object.values(Body).includes(body)
    ? Promise.resolve(body)
    : Promise.reject('Body does not exist.');
}

export function isGender() {
  return (gender: Gender) => Object.values(Gender).includes(gender)
    ? Promise.resolve(gender)
    : Promise.reject('Gender does not exist.');
}

export function areActivities() {
  return (activities: Activity[]) => includesAll(Object.values(Activity), activities)
    ? Promise.resolve(activities)
    : Promise.reject('Some activity does not exist.');
}

export function isPersonality() {
  return (personality: Personality) => Object.values(Personality).includes(personality)
    ? Promise.resolve(personality)
    : Promise.reject('Personality does not exist.');
}

export function areGoals() {
  return (goals: Goal[]) => includesAll(Object.values(Goal), goals)
    ? Promise.resolve(goals)
    : Promise.reject('Some goal does not exist.');
}

export function areGenders() {
  return (genders: Gender[]) => includesAll(Object.values(Gender), genders)
    ? Promise.resolve(genders)
    : Promise.reject('Some gender does not exist.');
}

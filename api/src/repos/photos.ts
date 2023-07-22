import { Op } from 'sequelize';

import db from '../db/db';
import { Photo } from '../db/schemas/models';

export function getPhotos(userId: string): Promise<Photo[]> {
  return Photo.findAll({
    where: { userId },
    order: [
      ['isDefault', 'DESC'],
      ['createdAt', 'ASC']
    ],
  });
}

export function getDefaultPhotos(usersIds: string[]): Promise<Photo[]> {
  return Photo.findAll({
    where: {
      userId: {
        [Op.in]: usersIds,
      },
      isDefault: true,
    },
  });
}

export function getPhoto(photoId: string): Promise<Photo | null> {
  return Photo.findByPk(photoId);
}

export async function createPhoto(userId: string, width: number, height: number, image: Buffer, thumbnail: Buffer, replacedPhotoId?: string): Promise<Photo> {
  const replacedPhoto = replacedPhotoId ? await Photo.findByPk(replacedPhotoId) : null;
  if (replacedPhotoId && !replacedPhoto) {
    throw new Error('Replaced photo does not exist.');
  }
  return await db.transaction(async (transaction) => {
    let isDefault = false;
    if (replacedPhoto) {
      isDefault = replacedPhoto.isDefault;
      await replacedPhoto.destroy({ transaction });
    }
    return await Photo.create({ userId, width, height, image, thumbnail, isDefault }, { transaction });
  });
}

export async function updatePhoto(photoId: string, data: Partial<Pick<Photo, 'isDefault'>>) {
  const photo = await Photo.findByPk(photoId);
  if (!photo) {
    throw new Error('Photo does not exist.');
  }
  await db.transaction(async (transaction) => {
    if ('isDefault' in data && data.isDefault !== photo.isDefault) {
      const photos = await getPhotos(photo.userId);
      const updatablePhoto = photos.find((p) => p.isDefault === data.isDefault);
      if (updatablePhoto) {
        await updatablePhoto.update({ isDefault: !data.isDefault }, { transaction });
      }
    }
    await photo.update(data, { transaction });
  });
  return photo;
}

export async function deletePhoto(photoId: string): Promise<void> {
  const photo = await Photo.findByPk(photoId);
  if (!photo) {
    throw new Error('Photo does not exist.');
  }
  await db.transaction(async (transaction) => {
    await photo.destroy({ transaction });
    if (photo.isDefault) {
      const photos = await getPhotos(photo.userId);
      const nextDefaultPhoto = photos.find(({ isDefault }) => !isDefault);
      if (nextDefaultPhoto) {
        await nextDefaultPhoto.update({ isDefault: true }, { transaction });
      }
    }
  });
}

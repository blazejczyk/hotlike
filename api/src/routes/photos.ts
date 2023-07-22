import { param, body } from 'express-validator';
import { pick } from 'lodash';

import { route } from '../core/request';
import { ForbiddenError, NotFoundError } from '../core/errors';
import { process } from '../services/photos';
import config from '../core/config';
import { photosConstants } from '../services/constants';
import { getPhotos, getPhoto, createPhoto, updatePhoto, deletePhoto } from '../repos/photos';
import { Photo } from '../db/schemas/models';
import { isPhotoId, isPhoto } from '../services/validators';

type TNormalizedPhoto = {
  id: string;
  width: number;
  height: number;
  isDefault: boolean;
  imageUrl: string;
  thumbnailUrl: string;
};

export default [
  route<TNormalizedPhoto, [], { file: string; replacedPhotoId?: string }>({
    method: 'post',
    path: '/photos',
    restricted: true,
    validations: ({ session: { userId } }) => [
      body('file')
        .isBase64().bail()
        .custom(isPhoto()),
      body('replacedPhotoId')
        .optional()
        .isUUID(4).bail()
        .custom(isPhotoId(userId)),
    ],
    callback: async ({ req: { body }, session }) => {
      const photos = await getPhotos(session.userId);
      if (!body.replacedPhotoId && photos.length === photosConstants.maxPhotosNumber) {
        throw new ForbiddenError(`There are already maximum (${photosConstants.maxPhotosNumber}) photos uploaded.`);
      }
      const [imageBuffer, thumbnailBuffer] = await process(body.file);
      const photo = await createPhoto(session.userId, photosConstants.image.dimension.width, photosConstants.image.dimension.height, imageBuffer, thumbnailBuffer, body.replacedPhotoId);
      return normalizePhoto(photo);
    },
  }),
  // route<TNormalizedPhoto, [], { file: string; replacedPhotoId?: string }>({
  //   method: 'post',
  //   path: '/photos',
  //   restricted: true,
  //   validations: ({ session: { userId } }) => [
  //     body('file')
  //       .isBase64(),
  //     body('replacedPhotoId')
  //       .optional()
  //       .isUUID(4).bail()
  //       .custom(isPhotoId(userId)),
  //   ],
  //   callback: async ({ req: { body }, session }) => {
  //     const photos = await getPhotos(session.userId);
  //     if (!body.replacedPhotoId && photos.length === photosConstants.maxPhotosNumber) {
  //       throw new ForbiddenError(`There are already maximum (${photosConstants.maxPhotosNumber}) photos uploaded.`);
  //     }
  //
  //     const buffer = Buffer.from(body.file, 'base64');
  //     if (buffer.byteLength > photosConstants.maxFileSize) {
  //       throw new ForbiddenError(`Maximum file size is: ${photosConstants.maxFileSize} bytes.`);
  //     }
  //
  //     const metadata = await getMetadata(buffer);
  //     if (!metadata) {
  //       throw new BadRequestError('Invalid image file.');
  //     }
  //
  //     const { format, width, height } = metadata;
  //     if (!format || !width || !height) {
  //       throw new InternalError('Metadata reading failed.');
  //     }
  //
  //     if (width !== height) { // the following code is prepared for a situation when we actually decide to get rid of this condition
  //       throw new ForbiddenError('Photo dimension must be a square.');
  //     }
  //
  //     if (width < photosConstants.image.dimension.width || height < photosConstants.image.dimension.height) {
  //       throw new ForbiddenError(`Photo dimension must be at least: ${photosConstants.image.dimension.width} x ${photosConstants.image.dimension.height} pixels.`);
  //     }
  //
  //     const [imageBuffer, thumbnailBuffer] = await Promise.all([
  //       (width > photosConstants.image.dimension.width || height > photosConstants.image.dimension.height || buffer.byteLength > config.photo.compressionThreshold)
  //         ? compress(buffer, photosConstants.image.dimension, config.photo.image.quality)
  //         : buffer,
  //       compress(buffer, photosConstants.thumbnail.dimension, config.photo.thumbnail.quality),
  //     ]);
  //
  //     const photo = await createPhoto(session.userId, photosConstants.image.dimension.width, photosConstants.image.dimension.height, imageBuffer, thumbnailBuffer, body.replacedPhotoId);
  //     return normalizePhoto(photo);
  //   },
  // }),

  route<TNormalizedPhoto, ['photoId'], { isDefault: boolean; }>({
    method: 'put',
    path: '/photos/:photoId',
    restricted: true,
    validations: ({ session: { userId } }) => [
      param('photoId')
        .isUUID(4).bail()
        .custom(isPhotoId(userId)),
      body('isDefault')
        .optional()
        .isBoolean(),
    ],
    callback: async ({ req: { params, body } }) => {
      const updatedPhoto = await updatePhoto(params.photoId, body);
      return normalizePhoto(updatedPhoto);
    },
  }),

  route<null, ['photoId']>({
    method: 'delete',
    path: '/photos/:photoId',
    restricted: true,
    validations: ({ session: { userId } }) => [
      param('photoId')
        .isUUID(4).bail()
        .custom(isPhotoId(userId)),
    ],
    callback: async ({ session, req: { params } }) => {
      const photos = await getPhotos(session.userId);
      if (photos.length === photosConstants.minPhotosNumber) {
        throw new ForbiddenError(`At least ${photosConstants.minPhotosNumber} photos are required.`);
      }
      await deletePhoto(params.photoId);
      return null;
    },
  }),

  route<void, ['photoId']>({
    method: 'get',
    path: '/photos/:photoId/image',
    restricted: true,
    validations: [
      param('photoId')
        .isUUID(4).bail()
        .custom(isPhotoId()),
    ],
    callback: async ({ req: { params }, res }) => {
      const photo = await getPhoto(params.photoId);
      if (!photo) {
        throw new NotFoundError('Photo does not exist.');
      }
      res.end(photo.image);
    },
  }),

  route<void, ['photoId']>({
    method: 'get',
    path: '/photos/:photoId/thumbnail',
    restricted: true,
    validations: [
      param('photoId')
        .isUUID(4).bail()
        .custom(isPhotoId()),
    ],
    callback: async ({ req: { params }, res }) => {
      const photo = await getPhoto(params.photoId);
      if (!photo) {
        throw new NotFoundError('Photo does not exist.');
      }
      res.end(photo.thumbnail);
    },
  }),
];

function normalizePhoto(photo: Photo): TNormalizedPhoto {
  return {
    ...pick(photo, ['id', 'width', 'height', 'isDefault']),
    imageUrl: config.photo.image.url(photo.id),
    thumbnailUrl: config.photo.thumbnail.url(photo.id),
  };
}

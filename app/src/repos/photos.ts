import { post, put, delete_ } from '../core/api';

export type TPhoto = {
  id: string;
  width: number;
  height: number;
  isDefault: boolean;
  order: number;
  imageUrl: string;
  thumbnailUrl: string;
};

export function createPhoto(file: string, replacedPhotoId?: string): Promise<TPhoto> {
  return post<TPhoto>('photos', { file, replacedPhotoId });
}

export function updatePhoto(photoId: string, data: Partial<Pick<TPhoto, 'isDefault'>>): Promise<TPhoto> {
  return put<TPhoto>(`photos/${photoId}`, data);
}

export function deletePhoto(photoId: string): Promise<null> {
  return delete_<null>(`photos/${photoId}`);
}

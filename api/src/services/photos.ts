import sharp from 'sharp';

import { photosConstants } from './constants';
import config from '../core/config';

export async function process(file: string): Promise<[Buffer, Buffer]> {
  const buffer = Buffer.from(file, 'base64');
  const metadata = await sharp(buffer).metadata();
  const { width, height } = metadata;
  if (!width || !height) {
    throw new Error('Metadata reading failed.');
  }
  return Promise.all([
    (width > photosConstants.image.dimension.width || height > photosConstants.image.dimension.height || buffer.byteLength > config.photo.compressionThreshold)
      ? compress(buffer, photosConstants.image.dimension, config.photo.image.quality)
      : buffer,
    compress(buffer, photosConstants.thumbnail.dimension, config.photo.thumbnail.quality),
  ]);
}

function compress(buffer: Buffer, { width, height }: { width: number, height: number }, quality: number): Promise<Buffer> {
  return sharp(buffer)
    .resize(width, height)
    .jpeg({ quality })
    .toBuffer();
}

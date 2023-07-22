/**
 * App configuration settings file.
 *
 * This SHOULD NOT contain any business related constants & logic!
 * (only "tech" settings required to proper app working)
 */

import { merge } from 'lodash';

import env from '../env';

type TConfig = {
  app: {
    port: string;
    maxBodySize: number; // MB
  };
  db: {
    name: string;
    username: string;
    password: string;
    host: string;
  };
  mail: {
    sender: string, // default sender email
    transport: {
      host: string;
      port: number;
      username: string;
      password: string;
    },
  },
  session: {
    secret: string;
  };
  apis: {
    google: {
      key: string; // this is TOP SECRET (!)
    };
    tomtom: {
      key: string; // this is TOP SECRET (!)
    };
  };
  photo: {
    compressionThreshold: number;
    image: {
      url: (photoId: string) => string;
      quality: number;
    };
    thumbnail: {
      url: (photoId: string) => string;
      quality: number;
    };
  };
  salt: string; // this CANNOT be changed in the future!
};

const config: TConfig = merge(
  {
    app: {
      port: process.env.PORT || '3000',
      maxBodySize: 5,
    },
    photo: {
      compressionThreshold: 307200, // 300 kB => files bigger than this will be compressed before saving
      image: {
        quality: 90,
      },
      thumbnail: {
        quality: 75,
      },
    },
  },
  env
);

export default config;

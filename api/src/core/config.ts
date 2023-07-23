/**
 * App configuration settings file.
 *
 * This SHOULD NOT contain any business related constants & logic!
 * (only "tech" settings required to proper app working)
 */

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
    compressionThreshold: number; // files bigger than this will be compressed before saving
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

const config: TConfig = {
  app: {
    port: getEnvValue('APP_PORT'),
    maxBodySize: 5,
  },
  db: {
    name: getEnvValue('DB_NAME'),
    username: getEnvValue('DB_USERNAME'),
    password: getEnvValue('DB_PASSWORD'),
    host: getEnvValue('DB_HOST'),
  },
  mail: {
    sender: getEnvValue('MAIL_SENDER'),
    transport: {
      host: getEnvValue('MAIL_TRANSPORT_HOST'),
      port: Number(getEnvValue('MAIL_TRANSPORT_PORT')),
      username: getEnvValue('MAIL_TRANSPORT_USERNAME'),
      password: getEnvValue('MAIL_TRANSPORT_PASSWORD'),
    },
  },
  session: {
    secret: getEnvValue('SESSION_SECRET'),
  },
  apis: {
    google: {
      key: getEnvValue('API_GOOGLE_KEY'),
    },
    tomtom: {
      key: getEnvValue('API_TOMTOM_KEY'),
    },
  },
  photo: {
    compressionThreshold: 307200, // 300 kB
    image: {
      url: (photoId: string) => `${getEnvValue('PHOTO_HOST')}/photos/${photoId}/image`,
      quality: 90,
    },
    thumbnail: {
      url: (photoId: string) => `${getEnvValue('PHOTO_HOST')}/photos/${photoId}/thumbnail`,
      quality: 75,
    },
  },
  salt: getEnvValue('SALT'),
};

function getEnvValue(envKey: string): string {
  const envValue = process.env[envKey];
  if (envValue === undefined) {
    throw new Error(`Environmental variable ${envKey} is missing.`);
  }
  return envValue;
}

export default config;

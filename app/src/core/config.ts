import { get } from 'lodash';
import Constants from 'expo-constants';

type TConfig = {
  api: {
    url: string;
  };
  io: {
    url: string;
  };
};

const apiUrl: string = get(Constants, ['expoConfig', 'extra', 'env', 'apiUrl']) || '';

const config: TConfig = {
  api: {
    url: apiUrl,
  },
  io: {
    url: apiUrl,
  },
};

export default config;

import { merge } from 'lodash';

import env from '../env';

type TConfig = {
  api: {
    url: string;
  };
  io: {
    url: string;
  };
};

const config: TConfig = merge({}, env);

export default config;

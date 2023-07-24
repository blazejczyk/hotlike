import { Sequelize } from 'sequelize';

import config from '../core/config';

const { name, username, password, host, port, ssl } = config.db;

export default new Sequelize(name, username, password, {
  host,
  port,
  dialect: 'postgres',
  ...(ssl ? {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  } : {}),
});

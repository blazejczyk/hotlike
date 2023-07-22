import { Sequelize } from 'sequelize';

import config from '../core/config';

const { name, username, password, host } = config.db;

export default new Sequelize(name, username, password, {
  host, dialect: 'postgres',
});

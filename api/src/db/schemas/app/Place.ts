import {
  Model, InferAttributes, InferCreationAttributes, CreationOptional,
  UUIDV4, STRING, DATE, NUMBER, ENUM,
} from 'sequelize';
import { Activity } from '../enums';

import db from '../../db';

class Place extends Model<InferAttributes<Place>, InferCreationAttributes<Place>> {
  declare id: CreationOptional<string>;
  declare sourceId: string;
  declare name: string;
  declare activity: Activity;
  declare latitude: string;
  declare longitude: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date | null>;
}

Place.init({
  id: {
    type: UUIDV4,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4,
  },
  sourceId: {
    type: STRING,
    allowNull: false,
    field: 'source_id',
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  activity: {
    type: ENUM(...Object.values(Activity)),
    allowNull: false,
  },
  latitude: {
    type: NUMBER,
    allowNull: false,
  },
  longitude: {
    type: NUMBER,
    allowNull: false,
  },
  createdAt: {
    type: DATE,
    allowNull: false,
    field: 'created_at',
  },
  updatedAt: {
    type: DATE,
    allowNull: false,
    field: 'updated_at',
  },
  deletedAt: {
    type: DATE,
    field: 'deleted_at',
  },
}, {
  sequelize: db,
  schema: 'app',
  tableName: 'places',
  modelName: 'place',
  paranoid: true,
});

export default Place;

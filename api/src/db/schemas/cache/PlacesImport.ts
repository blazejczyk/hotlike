import {
  Model, InferAttributes, InferCreationAttributes, CreationOptional,
  BIGINT, NUMBER, DATE, NOW,
} from 'sequelize';

import db from '../../db';

class PlacesImport extends Model<InferAttributes<PlacesImport>, InferCreationAttributes<PlacesImport>> {
  declare id: CreationOptional<string>;
  declare latitude: string;
  declare longitude: string;
  declare createdAt: CreationOptional<Date>;
}

PlacesImport.init({
  id: {
    type: BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
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
    defaultValue: NOW,
  },
}, {
  sequelize: db,
  schema: 'cache',
  tableName: 'places_imports',
  modelName: 'places_import',
  timestamps: false,
});

export default PlacesImport;

import {
  Model, InferAttributes, InferCreationAttributes, CreationOptional,
  STRING, DATE,
} from 'sequelize';

import db from '../../db';
import { Activity } from '../enums';

class TomtomPoiCategory extends Model<InferAttributes<TomtomPoiCategory>, InferCreationAttributes<TomtomPoiCategory>> {
  declare id: string;
  declare parentId: string | null;
  declare activity: Activity;
  declare createdAt: CreationOptional<Date>;
}

TomtomPoiCategory.init({
  id: {
    type: STRING,
    primaryKey: true,
    allowNull: false,
  },
  parentId: {
    type: STRING,
    field: 'parent_id',
  },
  activity: {
    type: STRING,
    allowNull: false,
  },
  createdAt: {
    type: DATE,
    allowNull: false,
    field: 'created_at',
  },
}, {
  sequelize: db,
  schema: 'cache',
  tableName: 'tomtom_poi_categories',
  modelName: 'tomtom_poi_category',
  timestamps: false,
});

export default TomtomPoiCategory;

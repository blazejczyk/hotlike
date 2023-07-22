import {
  Model, InferAttributes, InferCreationAttributes, CreationOptional,
  UUIDV4, NUMBER, BLOB, BOOLEAN, DATE,
} from 'sequelize';

import db from '../../db';

class Photo extends Model<InferAttributes<Photo>, InferCreationAttributes<Photo>> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare width: number;
  declare height: number;
  declare image: Buffer;
  declare thumbnail: Buffer;
  declare isDefault: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Photo.init({
  id: {
    type: UUIDV4,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4,
  },
  userId: {
    type: UUIDV4,
    allowNull: false,
    field: 'user_id',
  },
  width: {
    type: NUMBER,
    allowNull: false,
  },
  height: {
    type: NUMBER,
    allowNull: false,
  },
  image: {
    type: BLOB,
    allowNull: false,
  },
  thumbnail: {
    type: BLOB,
    allowNull: false,
  },
  isDefault: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_default',
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
}, {
  sequelize: db,
  schema: 'app',
  tableName: 'photos',
  modelName: 'photo',
});

export default Photo;

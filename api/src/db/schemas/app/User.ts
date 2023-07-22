import {
  Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute,
  UUIDV4, STRING, DATE, SMALLINT, BOOLEAN, ARRAY, NUMBER, ENUM, JSONB,
} from 'sequelize';

import db from '../../db';
import Photo from './Photo';
import { Activity, Body, Gender, Goal, Personality } from '../enums';

export type TActivation = {
  code: string;
  expirationTime: string;
};

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare cipher: string;
  declare email: string;
  declare name: string;
  declare gender: Gender;
  declare dateOfBirth: string;
  declare height: number;
  declare body: Body;
  declare smoking: boolean;
  declare activities: Activity[];
  declare personality: Personality;
  declare goals: Goal[];
  declare hasKids: boolean;
  declare preferredGenders: Gender[];
  declare prefersTaller: boolean;
  declare prefersShorter: boolean;
  declare rejectsSmoking: boolean;
  declare rejectsKids: boolean;
  declare latitude: string;
  declare longitude: string;
  declare disabled: CreationOptional<boolean>;
  declare notificationsToken: CreationOptional<string | null>;
  declare activation: CreationOptional<TActivation | null>;
  declare authedAt: CreationOptional<Date | null>
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date | null>;

  declare photos?: NonAttribute<Photo[]>;
}

User.init({
  id: {
    type: UUIDV4,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4,
  },
  cipher: {
    type: STRING,
    allowNull: false,
  },
  email: {
    type: STRING,
    allowNull: false,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  gender: {
    type: ENUM(...Object.values(Gender)),
    allowNull: false,
  },
  dateOfBirth: {
    type: DATE,
    allowNull: false,
    field: 'date_of_birth',
  },
  height: {
    type: SMALLINT,
    allowNull: false,
  },
  body: {
    type: ENUM(...Object.values(Body)),
    allowNull: false,
  },
  smoking: {
    type: BOOLEAN,
    allowNull: false,
  },
  activities: {
    type: ARRAY(ENUM(...Object.values(Activity))),
    allowNull: false,
  },
  personality: {
    type: ENUM(...Object.values(Personality)),
    allowNull: false,
  },
  goals: {
    type: ARRAY(ENUM(...Object.values(Goal))),
    allowNull: false,
  },
  hasKids: {
    type: BOOLEAN,
    allowNull: false,
    field: 'has_kids',
  },
  preferredGenders: {
    type: ARRAY(ENUM(...Object.values(Gender))),
    allowNull: false,
    field: 'preferred_genders',
  },
  prefersTaller: {
    type: BOOLEAN,
    allowNull: false,
    field: 'prefers_taller',
  },
  prefersShorter: {
    type: BOOLEAN,
    allowNull: false,
    field: 'prefers_shorter',
  },
  rejectsSmoking: {
    type: BOOLEAN,
    allowNull: false,
    field: 'rejects_smoking',
  },
  rejectsKids: {
    type: BOOLEAN,
    allowNull: false,
    field: 'rejects_kids',
  },
  latitude: {
    type: NUMBER,
    allowNull: false,
  },
  longitude: {
    type: NUMBER,
    allowNull: false,
  },
  disabled: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  notificationsToken: {
    type: STRING,
    field: 'notifications_token',
  },
  activation: {
    type: JSONB,
    field: 'activation',
  },
  authedAt: {
    type: DATE,
    field: 'authed_at',
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
  tableName: 'users',
  modelName: 'user',
  paranoid: true,
});

export default User;

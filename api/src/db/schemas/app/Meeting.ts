import {
  Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, HasManyGetAssociationsMixin,
  UUIDV4, DATE, BOOLEAN, JSONB,
} from 'sequelize';

import db from '../../db';
import User from './User';
import Place from './Place';
// import Message from './Message';

class Meeting extends Model<InferAttributes<Meeting>, InferCreationAttributes<Meeting>> {
  declare id: CreationOptional<string>;
  declare inviterUserId: string;
  declare inviteeUserId: string;
  declare placeId: string;
  declare expirationTime: Date;
  declare accepted: CreationOptional<boolean | null>;
  declare finished: CreationOptional<boolean>;
  declare inviterPolyline: CreationOptional<{ latitude: string, longitude: string }[] | null>;
  declare inviteePolyline: CreationOptional<{ latitude: string, longitude: string }[] | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date | null>;

  declare inviterUser?: NonAttribute<User>;
  declare inviteeUser?: NonAttribute<User>;
  declare place?: NonAttribute<Place>;
  // declare messages?: NonAttribute<Message>;

  // declare getMessages: HasManyGetAssociationsMixin<Message>;
}

Meeting.init({
  id: {
    type: UUIDV4,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4,
  },
  inviterUserId: {
    type: UUIDV4,
    allowNull: false,
    field: 'inviter_user_id',
  },
  inviteeUserId: {
    type: UUIDV4,
    allowNull: false,
    field: 'invitee_user_id'
  },
  placeId: {
    type: UUIDV4,
    allowNull: false,
    field: 'place_id'
  },
  expirationTime: {
    type: DATE,
    allowNull: false,
    field: 'expiration_time',
  },
  accepted: {
    type: BOOLEAN,
  },
  finished: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  inviterPolyline: {
    type: JSONB,
    field: 'inviter_polyline',
  },
  inviteePolyline: {
    type: JSONB,
    field: 'invitee_polyline',
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
  tableName: 'meetings',
  modelName: 'meeting',
  paranoid: true,
});

export default Meeting;

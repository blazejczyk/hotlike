import {
  Model, InferAttributes, InferCreationAttributes, CreationOptional,
  UUIDV4, STRING, BOOLEAN, DATE,
} from 'sequelize';

import db from '../../db';

class Message extends Model<InferAttributes<Message>, InferCreationAttributes<Message>> {
  declare id: CreationOptional<string>;
  declare meetingId: string;
  declare userId: string;
  declare text: string;
  declare read: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date | null>;

  // declare meeting?: NonAttribute<Meeting>;
  // declare senderUser?: NonAttribute<User>;
}

Message.init({
  id: {
    type: UUIDV4,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4,
  },
  meetingId: {
    type: UUIDV4,
    allowNull: false,
    field: 'meeting_id',
  },
  userId: {
    type: UUIDV4,
    allowNull: false,
    field: 'user_id',
  },
  text: {
    type: STRING,
    allowNull: false,
  },
  read: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
  tableName: 'messages',
  modelName: 'message',
  paranoid: true,
});

export default Message;

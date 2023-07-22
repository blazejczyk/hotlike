import User from './app/User';
import Place from './app/Place';
import Meeting from './app/Meeting';
import Photo from './app/Photo';
import Message from './app/Message';

import TomtomPoiCategory from './cache/TomtomPoiCategory';
import PlacesImport from './cache/PlacesImport';

// User - Meeting association
Meeting.belongsTo(User, { as: 'inviterUser' });
Meeting.belongsTo(User, { as: 'inviteeUser' });
// todo: hasMany ?

// Meeting - Place association
Meeting.belongsTo(Place);
Place.hasMany(Meeting);

// User - Photo association
Photo.belongsTo(User);
User.hasMany(Photo);

// Meeting - Message association
Message.belongsTo(Meeting);
Meeting.hasMany(Message);

// User - Message association
Message.belongsTo(User);
User.hasMany(Message);

export {
  User,
  Place,
  Meeting,
  Photo,
  Message,
  TomtomPoiCategory,
  PlacesImport,
};

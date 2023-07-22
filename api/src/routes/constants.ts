import { route } from '../core/request';
import { usersConstants, meetingsConstants, placesConstants, photosConstants, messagesConstants } from '../services/constants';

export default [
  route({
    method: 'get',
    path: '/constants',
    restricted: false,
    callback: () => {
      return {
        users: usersConstants,
        meetings: meetingsConstants,
        places: placesConstants,
        photos: photosConstants,
        messages: messagesConstants,
      };
    },
  }),
];

import { Request, Response, NextFunction, Router } from 'express';

import AuthRoutes from '../routes/auth';
import PredictionsRoutes from '../routes/predictions';
import SuggestionsRoutes from '../routes/suggestions';
import UsersRoutes from '../routes/users';
import MeetingsRoutes from '../routes/meetings';
import PlacesRoutes from '../routes/places';
import PhotosRoutes from '../routes/photos';
import MessagesRoutes from '../routes/messages';
import ConstantsRoutes from '../routes/constants';

const routes = [
  ...AuthRoutes,
  ...PredictionsRoutes,
  ...SuggestionsRoutes,
  ...UsersRoutes,
  ...MeetingsRoutes,
  ...PlacesRoutes,
  ...PhotosRoutes,
  ...MessagesRoutes,
  ...ConstantsRoutes,
];

export default routes.reduce((router, { method, path, respond }) => {
  router[method](path, respond as ((req: Request, res: Response, next: NextFunction) => any));
  return router;
}, Router());

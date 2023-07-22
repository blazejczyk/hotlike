import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import router from './router';
import config from './config';
import { handleUnexpectedError } from './request';

const app = express();

app.use(logger('dev'));
app.use(express.json({ limit: `${config.app.maxBodySize}mb` }));
app.use(express.urlencoded({ extended: false, limit: `${config.app.maxBodySize}mb` }));
app.use(cookieParser());
app.use('/', router);
app.use(handleUnexpectedError);
app.set('port', config.app.port);

export default app;

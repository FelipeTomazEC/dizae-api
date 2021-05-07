import { getAdminsRouter } from '@infra/express/routers/get-admins-router';
import { Express } from 'express';
import { getAuthRouter } from '../express/routers/get-auth-router';
import { getReportersRouter } from '../express/routers/get-reporters-router';
import { makeAdminsHandler } from './make-admins-handler';
import { makeAuthHandler } from './make-auth-handler';
import { makeReportersHandler } from './make-reporters-handler';

export const setupRoutes = (app: Express): void => {
  app.use(getReportersRouter(makeReportersHandler()));
  app.use(getAuthRouter(makeAuthHandler()));
  app.use(getAdminsRouter(makeAdminsHandler()));
};

import { getAdminRouter } from '@infra/express/routers/get-admin-router';
import { Express } from 'express';
import { getAuthRouter } from '../express/routers/get-auth-router';
import { getReporterRouter } from '../express/routers/get-reporter-router';

export const setupRoutes = (app: Express): void => {
  app.use(getReporterRouter());
  app.use(getAuthRouter());
  app.use(getAdminRouter());
};

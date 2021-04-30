import { Express } from 'express';
import { getReporterRouter } from '../routers/get-reporter-router';

export const setupRoutes = (app: Express): void => {
  app.use(getReporterRouter());
};

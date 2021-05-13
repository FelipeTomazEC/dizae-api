import { getAdminsRouter } from '@infra/express/routers/get-admins-router';
import { getItemCategoriesRouter } from '@infra/express/routers/get-item-categories-router';
import { getLocationRouter } from '@infra/express/routers/get-location-router';
import { getReportRouter } from '@infra/express/routers/get-report-router';
import { Express } from 'express';
import { getAuthRouter } from '../express/routers/get-auth-router';
import { getReportersRouter } from '../express/routers/get-reporters-router';
import { makeAdminsHandler } from './make-admins-handler';
import { makeAuthHandler } from './make-auth-handler';
import { makeItemCategoriesHandler } from './make-item-categories-handler';
import { makeLocationsHandler } from './make-locations-handler';
import { makeReportersHandler } from './make-reporters-handler';
import { makeReportsHandler } from './make-reports-handler';

export const setupRoutes = (app: Express): void => {
  app.use(getReportersRouter(makeReportersHandler()));
  app.use(getAuthRouter(makeAuthHandler()));
  app.use(getAdminsRouter(makeAdminsHandler()));
  app.use(getLocationRouter(makeLocationsHandler()));
  app.use(getItemCategoriesRouter(makeItemCategoriesHandler()));
  app.use(getReportRouter(makeReportsHandler()));
};

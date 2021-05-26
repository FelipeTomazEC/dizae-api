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
import {setupKnexConnection} from '../database/knex/setup-knex-connection';

export const setupRoutes = (app: Express): void => {
  const connection = setupKnexConnection(process.env.NODE_ENV);

  app.use(getReportersRouter(makeReportersHandler()));
  app.use(getAuthRouter(makeAuthHandler(connection)));
  app.use(getAdminsRouter(makeAdminsHandler(connection)));
  app.use(getLocationRouter(makeLocationsHandler(connection)));
  app.use(getItemCategoriesRouter(makeItemCategoriesHandler(connection)));
  app.use(getReportRouter(makeReportsHandler(connection)));
};

import { Express } from 'express';
import { serve, setup } from 'swagger-ui-express';
import specs from './routes-specifications';

export const setupDocs = (application: Express): void => {
  application.use('/docs', serve, setup(specs));
};

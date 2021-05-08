import { Router } from 'express';
import { ExpressHandleFunction } from './express-handle-function.type';

export interface AuthHandler {
  handleReportersAuthentication: ExpressHandleFunction;
  handleAdminAuthentication: ExpressHandleFunction;
}

export const getAuthRouter = (handler: AuthHandler): Router => {
  const router = Router();

  router.post('/auth/admins', handler.handleAdminAuthentication);
  router.post('/auth/reporters', handler.handleReportersAuthentication);

  return router;
};

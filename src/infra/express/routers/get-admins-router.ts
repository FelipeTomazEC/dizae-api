import { Router } from 'express';
import { ExpressHandleFunction } from './express-handle-function.type';

export interface AdminsHandler {
  handleRegisterAdmin: ExpressHandleFunction;
}

export const getAdminsRouter = (handler: AdminsHandler): Router => {
  const router = Router();

  router.post('/admins', handler.handleRegisterAdmin);

  return router;
};

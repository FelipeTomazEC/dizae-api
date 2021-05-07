import { Router } from 'express';
import { ExpressHandleFunction } from './express-handle-function.type';

export interface ReportersHandler {
  handleRegisterReporter: ExpressHandleFunction;
}

export const getReportersRouter = (handler: ReportersHandler): Router => {
  const router = Router();

  router.post('/reporters', handler.handleRegisterReporter);

  return router;
};

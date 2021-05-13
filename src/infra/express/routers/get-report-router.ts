import { Router } from 'express';
import { ExpressHandleFunction } from './express-handle-function.type';

export interface ReportsHandler {
  handleCreateReport: ExpressHandleFunction;
}

export const getReportRouter = (handler: ReportsHandler): Router => {
  const router = Router();

  router.post('/reports', handler.handleCreateReport);

  return router;
};

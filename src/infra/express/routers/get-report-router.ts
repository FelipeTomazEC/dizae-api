import { Router } from 'express';
import { ExpressHandleFunction } from './express-handle-function.type';

export interface ReportsHandler {
  handleCreateReport: ExpressHandleFunction;
  handleGetReports: ExpressHandleFunction;
}

export const getReportRouter = (handler: ReportsHandler): Router => {
  const router = Router();

  router.post('/reports', handler.handleCreateReport);
  router.get('/reports', handler.handleGetReports);

  return router;
};

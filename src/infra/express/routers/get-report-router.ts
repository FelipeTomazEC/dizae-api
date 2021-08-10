import { Router } from 'express';
import { ExpressHandleFunction } from './express-handle-function.type';

export interface ReportsHandler {
  handleCreateReport: ExpressHandleFunction;
  handleGetReports: ExpressHandleFunction;
  handlePartialUpdateReport: ExpressHandleFunction;
  handleGetSingleReport: ExpressHandleFunction;
}

export const getReportRouter = (handler: ReportsHandler): Router => {
  const router = Router();

  router.post('/reports', handler.handleCreateReport);
  router.get('/reports', handler.handleGetReports);
  router.patch('/reports/:report_id', handler.handlePartialUpdateReport);
  router.get('/reports/:report_id', handler.handleGetSingleReport);

  return router;
};

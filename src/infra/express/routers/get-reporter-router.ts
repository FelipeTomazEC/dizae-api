import { Router } from 'express';
import { makeReporterHandlers } from '../factories/make-reporter-handlers';

export const getReporterRouter = (): Router => {
  const router = Router();
  const handlers = makeReporterHandlers();

  router.post('/reporters', handlers.registerReporterHandler);

  return router;
};

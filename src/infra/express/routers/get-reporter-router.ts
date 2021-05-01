import { makeReporterHandlers } from '@infra/main/make-reporter-handlers';
import { Router } from 'express';

export const getReporterRouter = (): Router => {
  const router = Router();
  const handlers = makeReporterHandlers();

  router.post('/reporters', handlers.registerReporterHandler);

  return router;
};

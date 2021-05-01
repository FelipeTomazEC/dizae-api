import { makeAuthHandlers } from '@infra/main/make-auth-handlers';
import { Router } from 'express';

export const getAuthRouter = (): Router => {
  const router = Router();
  const handlers = makeAuthHandlers();

  router.post('/auth/reporters', handlers.authenticateReporterHandler);

  return router;
};

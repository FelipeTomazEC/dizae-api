import { makeAdminHandlers } from '@infra/main/make-admin-handlers';
import { Router } from 'express';

export const getAdminRouter = (): Router => {
  const router = Router();
  const handlers = makeAdminHandlers();

  router.post('/admins', handlers.registerAdminHandler);

  return router;
};

import { Router } from 'express';
import { ExpressHandleFunction } from './express-handle-function.type';

export interface LocationsHandler {
  handleCreateLocation: ExpressHandleFunction;
}

export const getLocationRouter = (handler: LocationsHandler): Router => {
  const router = Router();

  router.post('/locations', handler.handleCreateLocation);

  return router;
};

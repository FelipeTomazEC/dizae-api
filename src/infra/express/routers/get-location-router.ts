import { Router } from 'express';
import { ExpressHandleFunction } from './express-handle-function.type';

export interface LocationsHandler {
  handleCreateLocation: ExpressHandleFunction;
  handleAddItemToLocation: ExpressHandleFunction;
}

export const getLocationRouter = (handler: LocationsHandler): Router => {
  const router = Router();

  router.post('/locations', handler.handleCreateLocation);
  router.post('/locations/:locationId/items', handler.handleAddItemToLocation);

  return router;
};

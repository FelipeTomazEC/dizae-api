import { Router } from 'express';
import { ExpressHandleFunction } from './express-handle-function.type';

export interface LocationsHandler {
  handleCreateLocation: ExpressHandleFunction;
  handleAddItemToLocation: ExpressHandleFunction;
  handleGetLocationInfo: ExpressHandleFunction;
  handleGetAllLocationsInfo: ExpressHandleFunction;
}

export const getLocationRouter = (handler: LocationsHandler): Router => {
  const router = Router();

  router.post('/locations', handler.handleCreateLocation);
  router.post('/locations/:locationId/items', handler.handleAddItemToLocation);
  router.get('/locations/:location_id', handler.handleGetLocationInfo);
  router.get('/locations', handler.handleGetAllLocationsInfo);

  return router;
};

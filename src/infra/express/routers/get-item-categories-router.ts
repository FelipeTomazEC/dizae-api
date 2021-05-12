import { Router } from 'express';
import { ExpressHandleFunction } from './express-handle-function.type';

export interface ItemCategoriesHandler {
  handleCreateItemCategory: ExpressHandleFunction;
}

export const getItemCategoriesRouter = (
  handler: ItemCategoriesHandler,
): Router => {
  const router = Router();

  router.post('/item-categories', handler.handleCreateItemCategory);

  return router;
};

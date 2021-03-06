import { Router } from 'express';
import { ExpressHandleFunction } from './express-handle-function.type';

export interface ItemCategoriesHandler {
  handleCreateItemCategory: ExpressHandleFunction;
  handleGetItemCategories: ExpressHandleFunction;
}

export const getItemCategoriesRouter = (
  handler: ItemCategoriesHandler,
): Router => {
  const router = Router();

  router.post('/item-categories', handler.handleCreateItemCategory);
  router.get('/item-categories', handler.handleGetItemCategories);

  return router;
};

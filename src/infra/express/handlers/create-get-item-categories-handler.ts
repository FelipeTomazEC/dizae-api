import { GetItemCategoriesController } from '@interface-adapters/controllers/get-item-categories';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { GetItemCategoriesUseCase } from '@use-cases/get-item-categories/get-item-categories';
import { ItemCategoryRepository } from '@use-cases/interfaces/repositories/item-category';
import { Request, Response } from 'express';
import { createHttpPresenter } from '../helpers/create-http-presenter';
import { parseToHttpRequest } from '../helpers/parse-to-http-request';

interface Dependencies {
  repository: ItemCategoryRepository;
  logger: ErrorLogger;
}

export const createGetItemCategoriesHandler = (deps: Dependencies) => (
  req: Request,
  res: Response,
) => {
  const { repository, logger } = deps;
  const presenter = createHttpPresenter(res);
  const useCase = new GetItemCategoriesUseCase({ repository, presenter });
  const controller = new GetItemCategoriesController(
    logger,
    useCase,
    presenter,
  );

  controller.handle(parseToHttpRequest(req));
};

import { CreateItemCategoryController } from '@interface-adapters/controllers/create-item-category';
import { AuthorizationService } from '@interface-adapters/controllers/interfaces/authorization-service';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { HttpStatusCode } from '@interface-adapters/http/http-status-code';
import { CreateItemCategoryUseCase } from '@use-cases/create-item-category/create-item-category';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';
import { ItemCategoryRepository } from '@use-cases/interfaces/repositories/item-category';
import { Request, Response } from 'express';
import { createHttpPresenter } from '../helpers/create-http-presenter';
import { parseToHttpRequest } from '../helpers/parse-to-http-request';

interface Dependencies {
  itemCategoryRepo: ItemCategoryRepository;
  logger: ErrorLogger;
  adminRepo: AdminRepository;
  authorizer: AuthorizationService;
}

export const getCreateItemCategoryHandler = (deps: Dependencies) => (
  req: Request,
  res: Response,
) => {
  const { adminRepo, itemCategoryRepo, authorizer, logger } = deps;
  const presenter = createHttpPresenter(res, HttpStatusCode.RESOURCE_CREATED);
  const useCase = new CreateItemCategoryUseCase({
    adminRepo,
    itemCategoryRepo,
    presenter,
  });
  const controller = new CreateItemCategoryController(
    authorizer,
    logger,
    useCase,
    presenter,
  );

  controller.handle(parseToHttpRequest(req));
};

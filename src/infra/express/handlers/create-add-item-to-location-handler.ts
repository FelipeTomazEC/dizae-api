import { AddItemToLocationController } from '@interface-adapters/controllers/add-item-to-location';
import { AuthorizationService } from '@interface-adapters/controllers/interfaces/authorization-service';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { HttpStatusCode } from '@interface-adapters/http/http-status-code';
import { AddItemToLocationUseCase } from '@use-cases/add-item-to-location/add-item-to-location';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';
import { ItemCategoryRepository } from '@use-cases/interfaces/repositories/item-category';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import { Request, Response } from 'express';
import { createHttpPresenter } from '../helpers/create-http-presenter';
import { parseToHttpRequest } from '../helpers/parse-to-http-request';

interface Dependencies {
  adminRepo: AdminRepository;
  locationRepo: LocationRepository;
  categoryRepo: ItemCategoryRepository;
  authorizer: AuthorizationService;
  logger: ErrorLogger;
}

export const createAddItemToLocationHandler = (deps: Dependencies) => (
  req: Request,
  res: Response,
) => {
  const { adminRepo, authorizer, categoryRepo, locationRepo, logger } = deps;
  const presenter = createHttpPresenter(res, HttpStatusCode.RESOURCE_CREATED);
  const useCase = new AddItemToLocationUseCase({
    adminRepo,
    categoryRepo,
    locationRepo,
    presenter,
  });
  const controller = new AddItemToLocationController(
    authorizer,
    logger,
    useCase,
    presenter,
  );

  controller.handle(parseToHttpRequest(req));
};

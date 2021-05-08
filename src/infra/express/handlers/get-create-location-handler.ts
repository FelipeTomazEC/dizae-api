import { CreateLocationController } from '@interface-adapters/controllers/create-location';
import { AuthorizationService } from '@interface-adapters/controllers/interfaces/authorization-service';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { HttpStatusCode } from '@interface-adapters/http/http-status-code';
import { CreateLocationUseCase } from '@use-cases/create-location/create-location';
import { IdGenerator } from '@use-cases/interfaces/adapters/id-generator';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import { Request, Response } from 'express';
import { createHttpPresenter } from '../helpers/create-http-presenter';
import { parseToHttpRequest } from '../helpers/parse-to-http-request';

interface Dependencies {
  adminRepo: AdminRepository;
  idGenerator: IdGenerator;
  locationRepo: LocationRepository;
  authorizer: AuthorizationService;
  logger: ErrorLogger;
}

export const getCreateLocationHandler = (deps: Dependencies) => (
  req: Request,
  res: Response,
) => {
  const { adminRepo, logger, idGenerator, locationRepo, authorizer } = deps;
  const presenter = createHttpPresenter(res, HttpStatusCode.RESOURCE_CREATED);
  const useCase = new CreateLocationUseCase({
    adminRepo,
    idGenerator,
    locationRepo,
    presenter,
  });
  const controller = new CreateLocationController(
    authorizer,
    logger,
    useCase,
    presenter,
  );

  controller.handle(parseToHttpRequest(req));
};

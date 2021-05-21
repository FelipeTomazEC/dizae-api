import { GetAllLocationsInfoController } from '@interface-adapters/controllers/get-all-locations-info';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { GetAllLocationsInfoUseCase } from '@use-cases/get-all-locations-info/get-all-locations-info';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import { Request, Response } from 'express';
import { createHttpPresenter } from '../helpers/create-http-presenter';
import { parseToHttpRequest } from '../helpers/parse-to-http-request';

interface Dependencies {
  repository: LocationRepository;
  logger: ErrorLogger;
}

export const createGetAllLocationsInfoHandler = (deps: Dependencies) => (
  req: Request,
  res: Response,
) => {
  const { repository, logger } = deps;
  const presenter = createHttpPresenter(res);
  const useCase = new GetAllLocationsInfoUseCase({ repository, presenter });
  const controller = new GetAllLocationsInfoController(
    logger,
    useCase,
    presenter,
  );

  controller.handle(parseToHttpRequest(req));
};

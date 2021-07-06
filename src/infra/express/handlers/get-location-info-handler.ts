import { GetLocationInfoController } from '@interface-adapters/controllers/get-location-info';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { GetLocationInfoUseCase } from '@use-cases/get-location-info/get-location-info';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import { Request, Response } from 'express';
import { createHttpPresenter } from '../helpers/create-http-presenter';
import { parseToHttpRequest } from '../helpers/parse-to-http-request';

interface Dependencies {
  locationRepo: LocationRepository;
  logger: ErrorLogger;
}

export const getLocationInfoHandler = (deps: Dependencies) => (
  req: Request,
  res: Response,
) => {
  const { locationRepo, logger } = deps;
  const presenter = createHttpPresenter(res);
  const useCase = new GetLocationInfoUseCase({ locationRepo, presenter });
  const controller = new GetLocationInfoController(logger, useCase, presenter);

  controller.handle(parseToHttpRequest(req));
};

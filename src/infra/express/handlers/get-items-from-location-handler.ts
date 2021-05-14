import { GetItemsFromLocationController } from '@interface-adapters/controllers/get-items-from-location';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { GetItemsFromLocationUseCase } from '@use-cases/get-items-from-location/get-items-from-location';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import { Request, Response } from 'express';
import { createHttpPresenter } from '../helpers/create-http-presenter';
import { parseToHttpRequest } from '../helpers/parse-to-http-request';

interface Dependencies {
  locationRepo: LocationRepository;
  logger: ErrorLogger;
}

export const getItemsFromLocationHandler = (deps: Dependencies) => (
  req: Request,
  res: Response,
) => {
  const { locationRepo, logger } = deps;
  const presenter = createHttpPresenter(res);
  const useCase = new GetItemsFromLocationUseCase({ locationRepo, presenter });
  const controller = new GetItemsFromLocationController(
    logger,
    useCase,
    presenter,
  );

  controller.handle(parseToHttpRequest(req));
};

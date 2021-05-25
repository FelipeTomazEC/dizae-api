import { GetReportsController } from '@interface-adapters/controllers/get-reports';
import { AuthorizationService } from '@interface-adapters/controllers/interfaces/authorization-service';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { GetReportsUseCase } from '@use-cases/get-reports/get-reports';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import { ReportRepository } from '@use-cases/interfaces/repositories/report';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';
import { Request, Response } from 'express';
import { createHttpPresenter } from '../helpers/create-http-presenter';
import { parseToHttpRequest } from '../helpers/parse-to-http-request';

interface Dependencies {
  authorizer: AuthorizationService;
  reporterRepo: ReporterRepository;
  reportRepo: ReportRepository;
  adminRepo: AdminRepository;
  locationRepo: LocationRepository;
  logger: ErrorLogger;
}

export const createGetReportsHandler = (deps: Dependencies) => (
  req: Request,
  res: Response,
) => {
  const { adminRepo, authorizer, reportRepo } = deps;
  const { logger, reporterRepo, locationRepo } = deps;
  const presenter = createHttpPresenter(res);
  const useCase = new GetReportsUseCase({
    adminRepo,
    locationRepo,
    presenter,
    reportRepo,
    reporterRepo,
  });
  const controller = new GetReportsController(
    authorizer,
    logger,
    useCase,
    presenter,
  );

  controller.handle(parseToHttpRequest(req));
};

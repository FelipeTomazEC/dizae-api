import { CreateReportController } from '@interface-adapters/controllers/create-report';
import { AuthorizationService } from '@interface-adapters/controllers/interfaces/authorization-service';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { HttpStatusCode } from '@interface-adapters/http/http-status-code';
import { CreateReportUseCase } from '@use-cases/create-report/create-report';
import { IdGenerator } from '@use-cases/interfaces/adapters/id-generator';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import { ReportRepository } from '@use-cases/interfaces/repositories/report';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';
import { Request, Response } from 'express';
import { createHttpPresenter } from '../helpers/create-http-presenter';
import { parseToHttpRequest } from '../helpers/parse-to-http-request';

interface Dependencies {
  authorizer: AuthorizationService;
  idGenerator: IdGenerator;
  locationRepo: LocationRepository;
  logger: ErrorLogger;
  reporterRepo: ReporterRepository;
  reportRepo: ReportRepository;
}

export const createReportHandler = (deps: Dependencies) => (
  req: Request,
  res: Response,
) => {
  const { authorizer, idGenerator, locationRepo } = deps;
  const { reporterRepo, reportRepo, logger } = deps;
  const presenter = createHttpPresenter(res, HttpStatusCode.RESOURCE_CREATED);
  const useCase = new CreateReportUseCase({
    idGenerator,
    locationRepository: locationRepo,
    presenter,
    reportRepository: reportRepo,
    reporterRepository: reporterRepo,
  });
  const controller = new CreateReportController(
    authorizer,
    logger,
    useCase,
    presenter,
  );

  controller.handle(parseToHttpRequest(req));
};

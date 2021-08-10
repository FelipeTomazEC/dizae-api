import { Report } from '@entities/report/report';
import { GetReportInfoController } from '@interface-adapters/controllers/get-report-info';
import { AuthorizationService } from '@interface-adapters/controllers/interfaces/authorization-service';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { GetSingleReportUseCase } from '@use-cases/get-single-report/get-single-report';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';
import { GetByIdRepository } from '@use-cases/interfaces/repositories/common/get-by-id-repository';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';
import { Request, Response } from 'express';
import { createHttpPresenter } from '../helpers/create-http-presenter';
import { parseToHttpRequest } from '../helpers/parse-to-http-request';

interface Dependencies {
  authorizer: AuthorizationService;
  reportRepo: GetByIdRepository<Report>;
  adminRepo: AdminRepository;
  reporterRepo: ReporterRepository;
  locationRepo: LocationRepository;
  logger: ErrorLogger;
}

export const createGetSingleReportHandler = (deps: Dependencies) => (
  req: Request,
  res: Response,
) => {
  const { adminRepo, locationRepo, authorizer } = deps;
  const { reportRepo, reporterRepo, logger } = deps;
  const presenter = createHttpPresenter(res);
  const useCase = new GetSingleReportUseCase({
    adminRepo,
    locationRepo,
    presenter,
    reportRepo,
    reporterRepo,
  });

  const controller = new GetReportInfoController(
    authorizer,
    logger,
    useCase,
    presenter,
  );

  controller.handle(parseToHttpRequest(req));
};

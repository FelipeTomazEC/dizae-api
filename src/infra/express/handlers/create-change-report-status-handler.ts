import { Report } from '@entities/report/report';
import { ChangeReportStatusController } from '@interface-adapters/controllers/change-report-status';
import { AuthorizationService } from '@interface-adapters/controllers/interfaces/authorization-service';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { HttpStatusCode } from '@interface-adapters/http/http-status-code';
import { ChangeReportStatusUseCase } from '@use-cases/change-report-status/change-report-status';
import { GetByIdRepository } from '@use-cases/interfaces/repositories/common/get-by-id-repository';
import { UpdateRepository } from '@use-cases/interfaces/repositories/common/update-repository';
import { Request, Response } from 'express';
import { createHttpPresenter } from '../helpers/create-http-presenter';
import { parseToHttpRequest } from '../helpers/parse-to-http-request';

interface Dependencies {
  authorizer: AuthorizationService;
  reportUpdateRepo: UpdateRepository<Report>;
  reportGetByIdRepo: GetByIdRepository<Report>;
  logger: ErrorLogger;
}

export const createChangeReportStatusHandler = (deps: Dependencies) => (
  req: Request,
  res: Response,
) => {
  const { reportUpdateRepo, reportGetByIdRepo, authorizer, logger } = deps;
  const presenter = createHttpPresenter(res, HttpStatusCode.OK);
  const useCase = new ChangeReportStatusUseCase({
    presenter,
    reportGetByIdRepo,
    reportUpdateRepo,
  });
  const controller = new ChangeReportStatusController(
    authorizer,
    logger,
    useCase,
    presenter,
  );

  controller.handle(parseToHttpRequest(req));
};

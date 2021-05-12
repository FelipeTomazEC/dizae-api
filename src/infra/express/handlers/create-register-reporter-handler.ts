import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { RegisterReporterController } from '@interface-adapters/controllers/register-reporter';
import { HttpStatusCode } from '@interface-adapters/http/http-status-code';
import { IdGenerator } from '@use-cases/interfaces/adapters/id-generator';
import { PasswordEncoder } from '@use-cases/interfaces/adapters/password-encoder';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';
import { RegisterReporterUseCase } from '@use-cases/register-reporter/register-reporter';
import { Request, Response } from 'express';
import { createHttpPresenter } from '../helpers/create-http-presenter';
import { parseToHttpRequest } from '../helpers/parse-to-http-request';

interface Dependencies {
  repository: ReporterRepository;
  logger: ErrorLogger;
  idGenerator: IdGenerator;
  encoder: PasswordEncoder;
}

export const createRegisterReporterHandler = (deps: Dependencies) => (
  req: Request,
  res: Response,
): void => {
  const presenter = createHttpPresenter(res, HttpStatusCode.RESOURCE_CREATED);
  const useCase = new RegisterReporterUseCase({
    encoder: deps.encoder,
    idGenerator: deps.idGenerator,
    presenter,
    repository: deps.repository,
  });
  const controller = new RegisterReporterController(
    deps.logger,
    useCase,
    presenter,
  );

  controller.handle(parseToHttpRequest(req));
};

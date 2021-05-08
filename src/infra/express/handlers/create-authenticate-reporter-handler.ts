import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { PasswordEncoder } from '@use-cases/interfaces/adapters/password-encoder';
import { AuthenticationService } from '@use-cases/interfaces/adapters/authentication-service';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';
import { Request, Response } from 'express';
import { AuthenticateReporterUseCase } from '@use-cases/authenticate-reporter/authenticate-reporter';
import { Reporter } from '@entities/reporter/reporter';
import { AuthenticationController } from '@interface-adapters/controllers/authentication';
import { parseToHttpRequest } from '../helpers/parse-to-http-request';
import { createHttpPresenter } from '../helpers/create-http-presenter';

interface Dependencies {
  repository: ReporterRepository;
  encoder: PasswordEncoder;
  authService: AuthenticationService<Reporter>;
  logger: ErrorLogger;
}

export const createAuthenticateReporterHandler = (deps: Dependencies) => (
  req: Request,
  res: Response,
): void => {
  const { authService, encoder, logger, repository } = deps;
  const presenter = createHttpPresenter(res);
  const useCase = new AuthenticateReporterUseCase({
    authService,
    encoder,
    presenter,
    repository,
  });
  const controller = new AuthenticationController(logger, useCase, presenter);

  controller.handle(parseToHttpRequest(req));
};

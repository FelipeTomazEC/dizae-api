import { Request, Response } from 'express';
import { Admin } from '@entities/admin/admin';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { AuthenticationService } from '@use-cases/interfaces/adapters/authentication-service';
import { PasswordEncoder } from '@use-cases/interfaces/adapters/password-encoder';
import { AuthenticateAdminUseCase } from '@use-cases/authenticate-admin/authenticate-admin';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';
import { AuthenticationController } from '@interface-adapters/controllers/authentication';
import { createHttpPresenter } from '../helpers/create-http-presenter';
import { parseToHttpRequest } from '../helpers/parse-to-http-request';

interface Dependencies {
  repository: AdminRepository;
  encoder: PasswordEncoder;
  authService: AuthenticationService<Admin>;
  logger: ErrorLogger;
}

export const createAuthenticateAdminHandler = (deps: Dependencies) => (
  req: Request,
  res: Response,
) => {
  const { authService, encoder, logger, repository } = deps;
  const presenter = createHttpPresenter(res);
  const useCase = new AuthenticateAdminUseCase({
    authService,
    encoder,
    presenter,
    repository,
  });
  const controller = new AuthenticationController(logger, useCase, presenter);

  controller.handle(parseToHttpRequest(req));
};

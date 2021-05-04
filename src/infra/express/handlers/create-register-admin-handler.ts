import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { RegisterAdminController } from '@interface-adapters/controllers/register-admin';
import { HttpStatusCode } from '@interface-adapters/http/http-status-code';
import { IdGenerator } from '@use-cases/interfaces/adapters/id-generator';
import { PasswordEncoder } from '@use-cases/interfaces/adapters/password-encoder';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';
import { RegisterAdminUseCase } from '@use-cases/register-admin/register-admin';
import { Request, Response } from 'express';
import { createHttpPresenter } from '../helpers/create-http-presenter';
import { parseToHttpRequest } from '../helpers/parse-to-http-request';

interface Dependencies {
  adminRepo: AdminRepository;
  encoder: PasswordEncoder;
  logger: ErrorLogger;
  idGenerator: IdGenerator;
}
export const createRegisterAdminHandler = (deps: Dependencies) => (
  req: Request,
  res: Response,
) => {
  const { adminRepo, encoder, idGenerator, logger } = deps;
  const presenter = createHttpPresenter(res, HttpStatusCode.RESOURCE_CREATED);
  const useCase = new RegisterAdminUseCase({
    adminRepo,
    encoder,
    idGenerator,
    presenter,
  });
  const controller = new RegisterAdminController(logger, useCase, presenter);

  controller.handle(parseToHttpRequest(req));
};

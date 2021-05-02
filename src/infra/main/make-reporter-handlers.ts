import { InMemoryReporterRepository } from '@infra/database/repositories/in-memory-reporter-repository';
import { BcryptPasswordEncoder } from '@infra/implementations/bcrypt-password-encoder';
import { ConsoleErrorLogger } from '@infra/implementations/console-error-logger';
import { UUIDV4Generator } from '@infra/implementations/uuid-v4-generator';
import { createRegisterReporterHandler } from '../express/handlers/create-register-report-handler';

export const makeReporterHandlers = () => {
  const repository = InMemoryReporterRepository.getInstance();
  const idGenerator = new UUIDV4Generator();
  const encoder = new BcryptPasswordEncoder();
  const logger = new ConsoleErrorLogger();

  const registerReporterHandler = createRegisterReporterHandler({
    repository,
    encoder,
    idGenerator,
    logger,
  });

  return {
    registerReporterHandler,
  };
};

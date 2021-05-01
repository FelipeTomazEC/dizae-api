import { InMemoryReporterRepository } from '@infra/database/repositories/in-memory-reporter-repository';
import { BcryptPasswordEncoder } from '@infra/implementations/bcrypt-password-encoder';
import { ConsoleErrorLogger } from '@infra/implementations/console-error-logger';
import { UUIDV4Generator } from '@infra/implementations/uuid-v4-generator';
import { handleRegisterReporter } from '../express/handlers/handle-register-report';

export const makeReporterHandlers = () => {
  const repository = InMemoryReporterRepository.getInstance();
  const idGenerator = new UUIDV4Generator();
  const encoder = new BcryptPasswordEncoder();
  const logger = new ConsoleErrorLogger();

  const registerReporterHandler = handleRegisterReporter({
    repository,
    encoder,
    idGenerator,
    logger,
  });

  return {
    registerReporterHandler,
  };
};

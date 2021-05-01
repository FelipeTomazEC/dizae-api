import { InMemoryReporterRepository } from '@infra/database/repositories/in-memory-reporter-repository';
import { createAuthenticateReporterHandler } from '@infra/express/handlers/create-authenticate-reporter-handler';
import { BcryptPasswordEncoder } from '@infra/implementations/bcrypt-password-encoder';
import { ConsoleErrorLogger } from '@infra/implementations/console-error-logger';
import { JWTAuthService } from '@infra/implementations/jwt-auth-service';

export const makeAuthHandlers = () => {
  const reporterRepository = InMemoryReporterRepository.getInstance();
  const authService = new JWTAuthService('som3$secret');
  const encoder = new BcryptPasswordEncoder();
  const logger = new ConsoleErrorLogger();

  const authenticateReporterHandler = createAuthenticateReporterHandler({
    authService,
    encoder,
    logger,
    repository: reporterRepository,
  });

  return {
    authenticateReporterHandler,
  };
};

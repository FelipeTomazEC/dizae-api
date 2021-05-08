import { InMemoryReporterRepository } from '@infra/database/repositories/in-memory-reporter-repository';
import { createAuthenticateReporterHandler } from '@infra/express/handlers/create-authenticate-reporter-handler';
import { AuthHandler } from '@infra/express/routers/get-auth-router';
import { BcryptPasswordEncoder } from '@infra/implementations/bcrypt-password-encoder';
import { ConsoleErrorLogger } from '@infra/implementations/console-error-logger';
import { JWTAuthService } from '@infra/implementations/jwt-auth-service';

export const makeAuthHandler = (): AuthHandler => {
  const reporterRepository = InMemoryReporterRepository.getInstance();
  const authService = new JWTAuthService(process.env.JWT_SECRET!);
  const encoder = new BcryptPasswordEncoder();
  const logger = new ConsoleErrorLogger();

  const handleReportersAuthentication = createAuthenticateReporterHandler({
    authService,
    encoder,
    logger,
    repository: reporterRepository,
  });

  return {
    handleReportersAuthentication,
  };
};
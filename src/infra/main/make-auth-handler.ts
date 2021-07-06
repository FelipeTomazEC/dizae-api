import { KnexAdminRepository } from '@infra/database/knex/repositories/knex-admin-repository';
import { KnexReporterRepository } from '@infra/database/knex/repositories/knex-reporter-repository';
import { createAuthenticateAdminHandler } from '@infra/express/handlers/create-authenticate-admin-handler';
import { createAuthenticateReporterHandler } from '@infra/express/handlers/create-authenticate-reporter-handler';
import { AuthHandler } from '@infra/express/routers/get-auth-router';
import { BcryptPasswordEncoder } from '@infra/implementations/bcrypt-password-encoder';
import { ConsoleErrorLogger } from '@infra/implementations/console-error-logger';
import { JWTAuthService } from '@infra/implementations/jwt-auth-service';
import { Knex } from 'knex';

export const makeAuthHandler = (connection: Knex): AuthHandler => {
  const reporterRepository = new KnexReporterRepository(connection);
  const adminRepository = new KnexAdminRepository(connection);
  const reporterAuthService = new JWTAuthService(
    process.env.REPORTERS_JWT_SECRET!,
  );
  const adminAuthService = new JWTAuthService(process.env.ADMINS_JWT_SECRET!);
  const encoder = new BcryptPasswordEncoder();
  const logger = new ConsoleErrorLogger();

  const handleReportersAuthentication = createAuthenticateReporterHandler({
    authService: reporterAuthService,
    encoder,
    logger,
    repository: reporterRepository,
  });

  const handleAdminAuthentication = createAuthenticateAdminHandler({
    authService: adminAuthService,
    encoder,
    logger,
    repository: adminRepository,
  });

  return {
    handleReportersAuthentication,
    handleAdminAuthentication,
  };
};

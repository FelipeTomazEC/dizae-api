import { InMemoryAdminRepository } from '@infra/database/in-memory/in-memory-admin-repository';
import { createRegisterAdminHandler } from '@infra/express/handlers/create-register-admin-handler';
import { AdminsHandler } from '@infra/express/routers/get-admins-router';
import { BcryptPasswordEncoder } from '@infra/implementations/bcrypt-password-encoder';
import { ConsoleErrorLogger } from '@infra/implementations/console-error-logger';
import { UUIDV4Generator } from '@infra/implementations/uuid-v4-generator';

export const makeAdminsHandler = (): AdminsHandler => {
  const adminRepo = InMemoryAdminRepository.getInstance();
  const encoder = new BcryptPasswordEncoder();
  const logger = new ConsoleErrorLogger();
  const idGenerator = new UUIDV4Generator();

  const handleRegisterAdmin = createRegisterAdminHandler({
    adminRepo,
    encoder,
    idGenerator,
    logger,
  });

  return { handleRegisterAdmin };
};

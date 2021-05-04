import { InMemoryAdminRepository } from '@infra/database/repositories/in-memory-admin-repository';
import { createRegisterAdminHandler } from '@infra/express/handlers/create-register-admin-handler';
import { BcryptPasswordEncoder } from '@infra/implementations/bcrypt-password-encoder';
import { ConsoleErrorLogger } from '@infra/implementations/console-error-logger';
import { UUIDV4Generator } from '@infra/implementations/uuid-v4-generator';

export const makeAdminHandlers = () => {
  const adminRepo = InMemoryAdminRepository.getInstance();
  const encoder = new BcryptPasswordEncoder();
  const logger = new ConsoleErrorLogger();
  const idGenerator = new UUIDV4Generator();

  const registerAdminHandler = createRegisterAdminHandler({
    adminRepo,
    encoder,
    idGenerator,
    logger,
  });

  return { registerAdminHandler };
};

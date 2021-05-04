import { InMemoryAdminRepository } from '@infra/database/repositories/in-memory-admin-repository';
import { createRegisterAdminHandler } from '@infra/express/handlers/create-register-admin-handler';
import { BcryptPasswordEncoder } from '@infra/implementations/bcrypt-password-encoder';
import { ConsoleErrorLogger } from '@infra/implementations/console-error-logger';
import { JWTAuthService } from '@infra/implementations/jwt-auth-service';
import { UUIDV4Generator } from '@infra/implementations/uuid-v4-generator';

export const makeAdminHandlers = () => {
  const adminRepo = InMemoryAdminRepository.getInstance();
  const encoder = new BcryptPasswordEncoder();
  const authService = new JWTAuthService(process.env.ADMIN_JWT_SECRET!);
  const logger = new ConsoleErrorLogger();
  const idGenerator = new UUIDV4Generator();

  const registerAdminHandler = createRegisterAdminHandler({
    adminRepo,
    authService,
    encoder,
    idGenerator,
    logger,
  });

  return { registerAdminHandler };
};

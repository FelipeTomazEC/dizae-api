import { InMemoryAdminRepository } from '@infra/database/repositories/in-memory-admin-repository';
import { InMemoryLocationRepository } from '@infra/database/repositories/in-memory-location-repository';
import { getCreateLocationHandler } from '@infra/express/handlers/get-create-location-handler';
import { LocationsHandler } from '@infra/express/routers/get-location-router';
import { ConsoleErrorLogger } from '@infra/implementations/console-error-logger';
import { JWTAuthService } from '@infra/implementations/jwt-auth-service';
import { UUIDV4Generator } from '@infra/implementations/uuid-v4-generator';

export const makeLocationsHandler = (): LocationsHandler => {
  const adminRepo = InMemoryAdminRepository.getInstance();
  const locationRepo = InMemoryLocationRepository.getInstance();
  const authorizer = new JWTAuthService(process.env.ADMINS_JWT_SECRET!);
  const logger = new ConsoleErrorLogger();
  const idGenerator = new UUIDV4Generator();

  const handleCreateLocation = getCreateLocationHandler({
    adminRepo,
    authorizer,
    idGenerator,
    locationRepo,
    logger,
  });

  return { handleCreateLocation };
};

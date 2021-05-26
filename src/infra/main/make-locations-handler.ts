import { InMemoryItemCategoryRepository } from '@infra/database/in-memory/in-memory-item-category-repository';
import { InMemoryLocationRepository } from '@infra/database/in-memory/in-memory-location-repository';
import { KnexAdminRepository } from '@infra/database/knex/repositories/knex-admin-repository';
import { createAddItemToLocationHandler } from '@infra/express/handlers/create-add-item-to-location-handler';
import { createGetAllLocationsInfoHandler } from '@infra/express/handlers/create-get-all-locations-info-handler';
import { getCreateLocationHandler } from '@infra/express/handlers/get-create-location-handler';
import { getItemsFromLocationHandler } from '@infra/express/handlers/get-items-from-location-handler';
import { LocationsHandler } from '@infra/express/routers/get-location-router';
import { ConsoleErrorLogger } from '@infra/implementations/console-error-logger';
import { JWTAuthService } from '@infra/implementations/jwt-auth-service';
import { UUIDV4Generator } from '@infra/implementations/uuid-v4-generator';
import { Knex } from 'knex';

export const makeLocationsHandler = (connection: Knex): LocationsHandler => {
  const adminRepo = new KnexAdminRepository(connection);
  const locationRepo = InMemoryLocationRepository.getInstance();
  const categoryRepo = InMemoryItemCategoryRepository.getInstance();
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

  const handleAddItemToLocation = createAddItemToLocationHandler({
    adminRepo,
    authorizer,
    categoryRepo,
    locationRepo,
    logger,
  });

  const handleGetItemsFromLocation = getItemsFromLocationHandler({
    locationRepo,
    logger,
  });

  const handleGetAllLocationsInfo = createGetAllLocationsInfoHandler({
    repository: locationRepo,
    logger,
  });

  return {
    handleCreateLocation,
    handleAddItemToLocation,
    handleGetItemsFromLocation,
    handleGetAllLocationsInfo,
  };
};

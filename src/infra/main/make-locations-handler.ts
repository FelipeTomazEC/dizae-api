import { KnexAdminRepository } from '@infra/database/knex/repositories/knex-admin-repository';
import { KnexItemCategoryRepository } from '@infra/database/knex/repositories/knex-item-category-repository';
import { KnexLocationRepository } from '@infra/database/knex/repositories/knex-location-repository';
import { createAddItemToLocationHandler } from '@infra/express/handlers/create-add-item-to-location-handler';
import { createGetAllLocationsInfoHandler } from '@infra/express/handlers/create-get-all-locations-info-handler';
import { getCreateLocationHandler } from '@infra/express/handlers/get-create-location-handler';
import { getLocationInfoHandler } from '@infra/express/handlers/get-location-info-handler';
import { LocationsHandler } from '@infra/express/routers/get-location-router';
import { ConsoleErrorLogger } from '@infra/implementations/console-error-logger';
import { JWTAuthService } from '@infra/implementations/jwt-auth-service';
import { UUIDV4Generator } from '@infra/implementations/uuid-v4-generator';
import { Knex } from 'knex';

export const makeLocationsHandler = (connection: Knex): LocationsHandler => {
  const adminRepo = new KnexAdminRepository(connection);
  const locationRepo = new KnexLocationRepository(connection);
  const categoryRepo = new KnexItemCategoryRepository(connection);
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

  const handleGetLocationInfo = getLocationInfoHandler({
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
    handleGetLocationInfo,
    handleGetAllLocationsInfo,
  };
};

import { KnexAdminRepository } from '@infra/database/knex/repositories/knex-admin-repository';
import { KnexItemCategoryRepository } from '@infra/database/knex/repositories/knex-item-category-repository';
import { createGetItemCategoriesHandler } from '@infra/express/handlers/create-get-item-categories-handler';
import { getCreateItemCategoryHandler } from '@infra/express/handlers/get-create-item-category-handler';
import { ItemCategoriesHandler } from '@infra/express/routers/get-item-categories-router';
import { ConsoleErrorLogger } from '@infra/implementations/console-error-logger';
import { JWTAuthService } from '@infra/implementations/jwt-auth-service';
import { Knex } from 'knex';

export const makeItemCategoriesHandler = (
  connection: Knex,
): ItemCategoriesHandler => {
  const adminRepo = new KnexAdminRepository(connection);
  const authorizer = new JWTAuthService(process.env.ADMINS_JWT_SECRET!);
  const itemCategoryRepo = new KnexItemCategoryRepository(connection);
  const logger = new ConsoleErrorLogger();

  const handleCreateItemCategory = getCreateItemCategoryHandler({
    adminRepo,
    authorizer,
    itemCategoryRepo,
    logger,
  });

  const handleGetItemCategories = createGetItemCategoriesHandler({
    logger,
    repository: itemCategoryRepo,
  });

  return {
    handleCreateItemCategory,
    handleGetItemCategories,
  };
};

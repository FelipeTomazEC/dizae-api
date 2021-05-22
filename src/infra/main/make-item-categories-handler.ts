import { InMemoryAdminRepository } from '@infra/database/repositories/in-memory-admin-repository';
import { InMemoryItemCategoryRepository } from '@infra/database/repositories/in-memory-item-category-repository';
import { createGetItemCategoriesHandler } from '@infra/express/handlers/create-get-item-categories-handler';
import { getCreateItemCategoryHandler } from '@infra/express/handlers/get-create-item-category-handler';
import { ItemCategoriesHandler } from '@infra/express/routers/get-item-categories-router';
import { ConsoleErrorLogger } from '@infra/implementations/console-error-logger';
import { JWTAuthService } from '@infra/implementations/jwt-auth-service';

export const makeItemCategoriesHandler = (): ItemCategoriesHandler => {
  const adminRepo = InMemoryAdminRepository.getInstance();
  const authorizer = new JWTAuthService(process.env.ADMINS_JWT_SECRET!);
  const itemCategoryRepo = InMemoryItemCategoryRepository.getInstance();
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

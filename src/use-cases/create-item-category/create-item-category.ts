import { ItemCategory } from '@entities/item-category/item-category';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { Id } from '@entities/shared/id/id';
import { UseCaseInputPort } from '@use-cases/interfaces/ports/use-case-input-port';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';
import { ItemCategoryRepository } from '@use-cases/interfaces/repositories/item-category';
import { ResourceNotFoundError } from '@use-cases/shared/errors/resource-not-found-error';
import { isNullOrUndefined } from '@utils/is-null-or-undefined';
import { CreateItemCategoryRequest as Request } from './dtos/create-item-category-request';
import { ItemCategoryAlreadyExistsError } from './errors/item-category-already-exists-error';

interface Dependencies {
  adminRepo: AdminRepository;
  itemCategoryRepo: ItemCategoryRepository;
  presenter: UseCaseOutputPort<void>;
}

export class CreateItemCategoryUseCase implements UseCaseInputPort<Request> {
  constructor(private readonly dependencies: Dependencies) {}

  async execute(request: Request): Promise<void> {
    const { adminRepo, presenter, itemCategoryRepo } = this.dependencies;

    const adminIdOrError = Id.create({ value: request.adminId });
    if (adminIdOrError.isLeft()) {
      return presenter.failure(
        new InvalidParamError('adminId', adminIdOrError.value),
      );
    }

    const creatorId = adminIdOrError.value;
    const admin = await adminRepo.getById(creatorId);
    if (isNullOrUndefined(admin)) {
      return presenter.failure(new ResourceNotFoundError('Admin'));
    }

    const categoryOrError = ItemCategory.create({
      createdAt: Date.now(),
      creatorId: admin!.id.value,
      name: request.name,
    });

    if (categoryOrError.isLeft()) {
      return presenter.failure(categoryOrError.value);
    }

    const category = categoryOrError.value;

    const isCategoryAlreadyRegistered = await itemCategoryRepo.exists(
      category.name,
    );
    if (isCategoryAlreadyRegistered) {
      return presenter.failure(
        new ItemCategoryAlreadyExistsError(category.name),
      );
    }

    await itemCategoryRepo.save(category);

    return presenter.success();
  }
}

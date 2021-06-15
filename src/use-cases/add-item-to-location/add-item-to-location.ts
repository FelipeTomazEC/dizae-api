import { Item } from '@entities/location/item/item';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { UseCaseInputPort } from '@use-cases/interfaces/ports/use-case-input-port';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';
import { ItemCategoryRepository } from '@use-cases/interfaces/repositories/item-category';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import { ResourceNotFoundError } from '@use-cases/shared/errors/resource-not-found-error';
import { AddItemToLocationRequest as Request } from './dtos/add-item-to-location-request';

interface Dependencies {
  adminRepo: AdminRepository;
  categoryRepo: ItemCategoryRepository;
  locationRepo: LocationRepository;
  presenter: UseCaseOutputPort<void>;
}

export class AddItemToLocationUseCase implements UseCaseInputPort<Request> {
  constructor(private readonly dependencies: Dependencies) {}

  async execute(request: Request): Promise<void> {
    const { adminRepo, presenter, locationRepo } = this.dependencies;
    const { categoryRepo } = this.dependencies;
    const adminIdOrError = Id.create({ value: request.adminId });
    if (adminIdOrError.isLeft()) {
      return presenter.failure(
        new InvalidParamError('adminId', adminIdOrError.value),
      );
    }

    const admin = await adminRepo.getById(adminIdOrError.value);
    if (!admin) {
      return presenter.failure(new ResourceNotFoundError('Admin'));
    }

    const locationIdOrError = Id.create({ value: request.locationId });
    if (locationIdOrError.isLeft()) {
      return presenter.failure(new ResourceNotFoundError('Location'));
    }

    const location = await locationRepo.getLocationById(
      locationIdOrError.value,
    );
    if (!location) {
      return presenter.failure(new ResourceNotFoundError('Location'));
    }

    const categoryNameOrError = Name.create({ value: request.categoryName });
    if (categoryNameOrError.isLeft()) {
      return presenter.failure(new ResourceNotFoundError('Item Category'));
    }

    const categoryExists = await categoryRepo.exists(categoryNameOrError.value);
    if (!categoryExists) {
      return presenter.failure(new ResourceNotFoundError('Item Category'));
    }

    const itemOrError = Item.create({
      categoryName: request.categoryName,
      createdAt: new Date(),
      creatorId: request.adminId,
      image: request.image,
      name: request.name,
    });

    if (itemOrError.isLeft()) {
      return presenter.failure(itemOrError.value);
    }

    const item = itemOrError.value;
    location.addItem(item);

    await locationRepo.save(location);

    return presenter.success();
  }
}

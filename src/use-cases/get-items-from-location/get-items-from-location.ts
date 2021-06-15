import { Id } from '@entities/shared/id/id';
import { UseCaseInputPort } from '@use-cases/interfaces/ports/use-case-input-port';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import { ResourceNotFoundError } from '@use-cases/shared/errors/resource-not-found-error';
import { GetItemsFromLocationRequest as Request } from './dtos/get-items-from-location-request';
import {
  GetItemsFromLocationResponse,
  ItemCollection,
} from './dtos/get-items-from-location-response';

interface Dependencies {
  locationRepo: LocationRepository;
  presenter: UseCaseOutputPort<GetItemsFromLocationResponse>;
}

export class GetItemsFromLocationUseCase implements UseCaseInputPort<Request> {
  constructor(private readonly dependencies: Dependencies) {}

  async execute(request: Request): Promise<void> {
    const { locationRepo, presenter } = this.dependencies;

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

    const items: ItemCollection = location.getItems().map((item) => ({
      image: item.image,
      name: item.name.value,
      category: item.categoryName.value,
      createdAt: item.createdAt.getTime(),
    }));

    return presenter.success({ items });
  }
}

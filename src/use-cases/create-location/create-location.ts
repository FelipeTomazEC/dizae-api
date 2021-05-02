import { Id } from '@entities/shared/id/id';
import { Location } from '@entities/location/location';
import { IdGenerator } from '@use-cases/interfaces/adapters/id-generator';
import { UseCaseInputPort } from '@use-cases/interfaces/ports/use-case-input-port';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import { ResourceNotFoundError } from '@use-cases/shared/errors/resource-not-found-error';
import { isNullOrUndefined } from '@utils/is-null-or-undefined';
import { CreateLocationRequest as Request } from './dtos/create-location-request';
import { CreateLocationResponse as Response } from './dtos/create-location-response';
import { LocationAlreadyRegisteredError } from './errors/location-already-registered-error';

interface Dependencies {
  adminRepo: AdminRepository;
  idGenerator: IdGenerator;
  locationRepo: LocationRepository;
  presenter: UseCaseOutputPort<Response>;
}

export class CreateLocationUseCase implements UseCaseInputPort<Request> {
  constructor(private readonly dependencies: Dependencies) {}

  async execute(request: Request): Promise<void> {
    const { adminRepo, idGenerator, locationRepo } = this.dependencies;
    const { presenter } = this.dependencies;

    const adminIdOrError = Id.create({ value: request.adminId });
    if (adminIdOrError.isLeft()) {
      return presenter.failure(new ResourceNotFoundError('Admin'));
    }

    const adminId = adminIdOrError.value;
    const creator = await adminRepo.getById(adminId);
    if (isNullOrUndefined(creator)) {
      return presenter.failure(new ResourceNotFoundError('Admin'));
    }

    const locationOrError = Location.create({
      createdAt: Date.now(),
      creatorId: creator!.id.value,
      id: idGenerator.generate().value,
      name: request.name,
    });

    if (locationOrError.isLeft()) {
      return presenter.failure(locationOrError.value);
    }

    const location = locationOrError.value;
    if (locationRepo.exists(location.name)) {
      const error = new LocationAlreadyRegisteredError(location.name);
      return presenter.failure(error);
    }

    await locationRepo.save(location);

    return presenter.success({
      locationId: location.id.value,
    });
  }
}

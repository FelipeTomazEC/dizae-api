import { Admin } from '@entities/admin/admin';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { getMock } from '@test/test-helpers/get-mock';
import { IdGenerator } from '@use-cases/interfaces/adapters/id-generator';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import { ResourceNotFoundError } from '@use-cases/shared/errors/resource-not-found-error';
import { Location } from '@entities/location/location';
import faker from 'faker';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { NullValueError } from '@entities/shared/errors/null-value-error';
import { left } from '@shared/either.type';
import { CreateLocationUseCase } from '@use-cases/create-location/create-location';
import { CreateLocationRequest as Request } from '@use-cases/create-location/dtos/create-location-request';
import { CreateLocationResponse as Response } from '@use-cases/create-location/dtos/create-location-response';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';
import { LocationAlreadyRegisteredError } from '@use-cases/create-location/errors/location-already-registered-error';

describe('Create location use case tests.', () => {
  const locationRepo = getMock<LocationRepository>(['exists', 'save']);
  const adminRepo = getMock<AdminRepository>(['getById']);
  const presenter = getMock<UseCaseOutputPort<Response>>([
    'failure',
    'success',
  ]);
  const idGenerator = getMock<IdGenerator>(['generate']);
  const sut = new CreateLocationUseCase({
    locationRepo,
    adminRepo,
    presenter,
    idGenerator,
  });

  const admin = Admin.create({
    avatar: faker.image.avatar(),
    createdAt: Date.now(),
    email: faker.internet.email(),
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    password: 'som3-p@$$Word',
  }).value as Admin;

  const id = Id.create({ value: faker.datatype.uuid() }).value as Id;

  const request: Request = {
    adminId: admin.id.value,
    name: faker.commerce.department(),
  };

  beforeAll(() => {
    jest.spyOn(adminRepo, 'getById').mockResolvedValue(admin);
    jest.spyOn(idGenerator, 'generate').mockReturnValue(id);
    jest.spyOn(Date, 'now').mockReturnValue(Date.now());
    jest.spyOn(locationRepo, 'exists').mockResolvedValue(false);
  });

  it('should validate if the admin exists.', async () => {
    jest.spyOn(adminRepo, 'getById').mockResolvedValueOnce(undefined);

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(
      new ResourceNotFoundError('Admin'),
    );
  });

  it('should not save duplicated locations.', async () => {
    jest.spyOn(locationRepo, 'exists').mockResolvedValueOnce(true);
    const locationName = Name.create({ value: request.name }).value as Name;

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(
      new LocationAlreadyRegisteredError(locationName),
    );
  });

  it('should pass any validation errors through the failure method of the presenter.', async () => {
    const error = new InvalidParamError('property', new NullValueError());
    jest.spyOn(Location, 'create').mockReturnValueOnce(left(error));

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(error);
  });

  it('should save the new location and send the id to the presenter.', async () => {
    await sut.execute(request);
    const location = Location.create({
      createdAt: Date.now(),
      creatorId: request.adminId,
      id: id.value,
      name: request.name,
    }).value as Location;

    expect(locationRepo.save).toBeCalledWith(location);
    expect(presenter.success).toBeCalledWith({
      locationId: id.value,
    });
  });
});

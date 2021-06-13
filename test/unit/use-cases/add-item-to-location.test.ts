import { Admin } from '@entities/admin/admin';
import { Item } from '@entities/location/item/item';
import { Location } from '@entities/location/location';
import { left } from '@shared/either.type';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { getMock } from '@test/test-helpers/get-mock';
import { AddItemToLocationUseCase } from '@use-cases/add-item-to-location/add-item-to-location';
import { AddItemToLocationRequest } from '@use-cases/add-item-to-location/dtos/add-item-to-location-request';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';
import { ItemCategoryRepository } from '@use-cases/interfaces/repositories/item-category';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import { ResourceNotFoundError } from '@use-cases/shared/errors/resource-not-found-error';
import faker from 'faker';

describe('Add item to location use case tests.', () => {
  const locationRepo = getMock<LocationRepository>(['getLocationById', 'save']);
  const adminRepo = getMock<AdminRepository>(['getById']);
  const categoryRepo = getMock<ItemCategoryRepository>(['exists']);
  const presenter = getMock<UseCaseOutputPort<any>>(['failure', 'success']);
  const sut = new AddItemToLocationUseCase({
    locationRepo,
    adminRepo,
    categoryRepo,
    presenter,
  });

  const request: AddItemToLocationRequest = {
    locationId: faker.datatype.uuid(),
    adminId: faker.datatype.uuid(),
    image: faker.image.image(),
    name: faker.commerce.product(),
    categoryName: faker.commerce.productMaterial(),
  };

  let location: Location;

  beforeAll(() => {
    jest.spyOn(Date, 'now').mockReturnValue(Date.now());

    location = Location.create({
      name: faker.commerce.department(),
      createdAt: Date.now(),
      creatorId: faker.datatype.uuid(),
      id: request.locationId,
    }).value as Location;

    const admin = Admin.create({
      avatar: faker.image.avatar(),
      createdAt: new Date(),
      email: faker.internet.email(),
      id: request.adminId,
      name: faker.name.findName(),
      password: 'some$P4ssw0rd',
    }).value as Admin;

    jest.spyOn(locationRepo, 'getLocationById').mockResolvedValue(location);
    jest.spyOn(adminRepo, 'getById').mockResolvedValue(admin);
    jest.spyOn(categoryRepo, 'exists').mockResolvedValue(true);
  });

  it('should verify if the location exists.', async () => {
    jest
      .spyOn(locationRepo, 'getLocationById')
      .mockResolvedValueOnce(undefined);

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(
      new ResourceNotFoundError('Location'),
    );
  });

  it('should verify if the admin exists.', async () => {
    jest.spyOn(adminRepo, 'getById').mockResolvedValueOnce(undefined);

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(
      new ResourceNotFoundError('Admin'),
    );
  });

  it('should verify if the category exists.', async () => {
    jest.spyOn(categoryRepo, 'exists').mockResolvedValueOnce(false);

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(
      new ResourceNotFoundError('Item Category'),
    );
  });

  it('should repass creation errors to the presenter.', async () => {
    const error = new MissingParamError('name');
    jest.spyOn(Item, 'create').mockReturnValueOnce(left(error));

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(error);
  });

  it('should insert the new item in the location.', async () => {
    const item = Item.create({
      categoryName: request.categoryName,
      createdAt: Date.now(),
      creatorId: request.adminId,
      image: request.image,
      name: request.name,
    }).value as Item;

    await sut.execute(request);

    expect(location.getItems()).toContainEqual(item);
  });

  it('should update the location in the repository and inform the presenter.', async () => {
    await sut.execute(request);

    expect(locationRepo.save).toBeCalled();
    expect(presenter.success).toBeCalled();
  });
});

import { Item } from '@entities/location/item/item';
import { Location } from '@entities/location/location';
import { Id } from '@entities/shared/id/id';
import { left } from '@shared/either.type';
import { getMock } from '@test/test-helpers/get-mock';
import { ItemCollection } from '@use-cases/get-location-info/dtos/get-location-info-response';
import { GetLocationInfoUseCase } from '@use-cases/get-location-info/get-location-info';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import { ResourceNotFoundError } from '@use-cases/shared/errors/resource-not-found-error';
import faker from 'faker';

describe('Get items from a location use case.', () => {
  const locationRepo = getMock<LocationRepository>(['getLocationById']);
  const presenter = getMock<UseCaseOutputPort<any>>(['failure', 'success']);
  const sut = new GetLocationInfoUseCase({ locationRepo, presenter });
  const request = {
    locationId: faker.datatype.uuid(),
  };

  let location: Location;

  beforeAll(() => {
    const createItem = (): Item =>
      Item.create({
        categoryName: faker.commerce.productMaterial(),
        createdAt: new Date(new Date().setMilliseconds(0)),
        creatorId: faker.datatype.uuid(),
        image: faker.image.image(),
        name: faker.commerce.productName(),
      }).value as Item;

    location = Location.create({
      createdAt: new Date(new Date().setMilliseconds(0)),
      creatorId: faker.datatype.uuid(),
      id: request.locationId,
      name: faker.commerce.department(),
    }).value as Location;

    const numberOfItems = Math.floor(Math.random() * 50);
    new Array(numberOfItems)
      .fill(1)
      .forEach(() => location.addItem(createItem()));

    jest.spyOn(locationRepo, 'getLocationById').mockResolvedValue(location);
  });

  it('should return not found if the id is not valid.', async () => {
    jest.spyOn(Id, 'create').mockReturnValueOnce(left(new Error()));

    await sut.execute({ locationId: 'invalid-uuid' });

    expect(presenter.failure).toBeCalledWith(
      new ResourceNotFoundError('Location'),
    );
  });

  it('should inform if the location is not found in the repository.', async () => {
    jest
      .spyOn(locationRepo, 'getLocationById')
      .mockResolvedValueOnce(undefined);

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(
      new ResourceNotFoundError('Location'),
    );
  });

  it(`should return the location's info and its items.`, async () => {
    const items: ItemCollection = location.getItems().map((item) => ({
      image: item.image,
      name: item.name.value,
      category: item.categoryName.value,
      createdAt: item.createdAt.getTime(),
    }));

    await sut.execute(request);

    expect(presenter.success).toBeCalledWith({
      name: location.name.value,
      createdAt: location.createdAt.getTime(),
      items,
    });
  });
});

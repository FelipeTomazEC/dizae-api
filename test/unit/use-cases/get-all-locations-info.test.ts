import { Item } from '@entities/location/item/item';
import { Location } from '@entities/location/location';
import { generateRandomCollection } from '@test/test-helpers/generate-random-collection';
import { getMock } from '@test/test-helpers/get-mock';
import { GetAllLocationsInfoUseCase } from '@use-cases/get-all-locations-info/get-all-locations-info';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import faker from 'faker';

describe('Get all locations info use case tests.', () => {
  const repository = getMock<LocationRepository>(['getAll']);
  const presenter = getMock<UseCaseOutputPort<any>>(['success']);
  const sut = new GetAllLocationsInfoUseCase({ repository, presenter });
  let locations: Location[];

  beforeAll(() => {
    locations = generateRandomCollection<Location>(
      () =>
        Location.create({
          createdAt: new Date(new Date().setMilliseconds(0)),
          creatorId: faker.datatype.uuid(),
          id: faker.datatype.uuid(),
          name: faker.commerce.department(),
        }).value as Location,
    );

    locations.forEach((location) => {
      const items = generateRandomCollection<Item>(
        () =>
          Item.create({
            categoryName: faker.commerce.productMaterial(),
            createdAt: Date.now(),
            creatorId: faker.datatype.uuid(),
            image: faker.image.image(),
            name: faker.commerce.product(),
          }).value as Item,
      );

      items.forEach((item) => location.addItem(item));

      jest.spyOn(repository, 'getAll').mockResolvedValue(locations);
    });
  });

  it('should return all locations infos.', async () => {
    const locationsData = locations.map((location) => ({
      id: location.id.value,
      name: location.name.value,
      numberOfItems: location.getItems().length,
    }));

    await sut.execute();

    expect(presenter.success).toBeCalledWith({ locations: locationsData });
  });
});

import { Admin } from '@entities/admin/admin';
import { ItemCategory } from '@entities/item-category/item-category';
import { Item } from '@entities/location/item/item';
import { Location } from '@entities/location/location';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import faker from 'faker';

export const locationRepositoryTests = (
  sut: LocationRepository,
  admin: Admin,
  category: ItemCategory,
): void => {
  const location = Location.create({
    createdAt: new Date(new Date().setMilliseconds(0)),
    creatorId: admin.id.value,
    id: faker.datatype.uuid(),
    name: faker.commerce.department(),
  }).value as Location;

  it('should return true if the location exists, false otherwise.', async () => {
    await sut.save(location);

    const newName = Name.create({ value: faker.commerce.department() })
      .value as Name;
    const isNewNameRegistered = await sut.exists(newName);
    const isLocationRegistered = await sut.exists(location.name);

    expect(isNewNameRegistered).toBe(false);
    expect(isLocationRegistered).toBe(true);
  });

  it('should return a location by its id.', async () => {
    const retrieved = await sut.getLocationById(location.id);

    expect(retrieved).toStrictEqual(location);
  });

  it('should return undefined when the id is not registered.', async () => {
    const randomId = Id.create({ value: faker.datatype.uuid() }).value as Id;
    const retrieved = await sut.getLocationById(randomId);

    expect(retrieved).toBeFalsy();
  });

  it('should return all locations, include their items.', async () => {
    const createLocation = () => {
      const loc = Location.create({
        createdAt: new Date(new Date().setMilliseconds(0)),
        creatorId: admin.id.value,
        id: faker.datatype.uuid(),
        name: faker.commerce.department().concat(faker.random.alphaNumeric()),
      }).value as Location;

      const item = Item.create({
        categoryName: category.name.value,
        createdAt: Date.now(),
        creatorId: admin.id.value,
        image: faker.image.image(),
        name: faker.commerce.product().concat(faker.random.alphaNumeric()),
      }).value as Item;

      loc.addItem(item);

      return loc;
    };

    const location1 = createLocation();
    const location2 = createLocation();

    const alreadySaved = await sut.getAll();

    await Promise.all([sut.save(location1), sut.save(location2)]);

    const retrieved = await sut.getAll();
    expect(retrieved.length).toBe(alreadySaved.length + 2);
    expect(retrieved.find((r) => r.id.isEqual(location1.id))).toStrictEqual(
      location1,
    );
    expect(retrieved.find((r) => r.id.isEqual(location2.id))).toStrictEqual(
      location2,
    );
  });

  it('should update instead of duplicating when saving an existent location.', async () => {
    const newLocation = Location.create({
      id: faker.datatype.uuid(),
      name: 'User Test',
      createdAt: new Date(new Date().setMilliseconds(0)),
      creatorId: admin.id.value,
    }).value as Location;

    await sut.save(newLocation);
    await sut.save(newLocation);
    const registered = await sut.getAll();

    expect(registered.filter((r) => r.id.isEqual(newLocation.id)).length).toBe(
      1,
    );
  });
};

import { Location } from '@entities/location/location';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { InMemoryLocationRepository } from '@infra/database/repositories/in-memory-location-repository';
import faker from 'faker';

describe('In memory location repository tests.', () => {
  const sut = InMemoryLocationRepository.getInstance();

  const location = Location.create({
    createdAt: Date.now(),
    creatorId: faker.datatype.uuid(),
    id: faker.datatype.uuid(),
    name: faker.commerce.department(),
  }).value as Location;

  it('should save the location without errors.', async () => {
    expect(sut.save(location)).resolves.not.toThrow();
  });

  it('should return true if the location exists, false otherwise.', async () => {
    const newName = Name.create({ value: faker.commerce.department() })
      .value as Id;
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

  it('should be a singleton.', () => {
    const instance1 = InMemoryLocationRepository.getInstance();
    const instance2 = InMemoryLocationRepository.getInstance();

    expect(instance1).toEqual(instance2);
  });
});
import { Admin } from '@entities/admin/admin';
import { ItemCategory } from '@entities/item-category/item-category';
import { InMemoryLocationRepository } from '@infra/database/in-memory/in-memory-location-repository';
import faker from 'faker';
import { locationRepositoryTests } from '../common/location-repository-tests';

describe('In memory location repository tests.', () => {
  const sut = InMemoryLocationRepository.getInstance();
  const category = ItemCategory.create({
    createdAt: Date.now(),
    creatorId: faker.datatype.uuid(),
    name: faker.commerce.productMaterial(),
  }).value as ItemCategory;

  const admin = Admin.create({
    avatar: faker.image.avatar(),
    createdAt: Date.now(),
    email: faker.internet.email(),
    id: faker.datatype.uuid(),
    name: 'Admin Tests',
    password: 'Some3PA$$word',
  }).value as Admin;

  locationRepositoryTests(sut, admin, category);

  it('should be a singleton.', () => {
    const instance1 = InMemoryLocationRepository.getInstance();
    const instance2 = InMemoryLocationRepository.getInstance();

    expect(instance1).toEqual(instance2);
  });
});

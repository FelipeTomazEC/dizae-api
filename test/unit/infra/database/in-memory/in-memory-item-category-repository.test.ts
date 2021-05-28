import { Admin } from '@entities/admin/admin';
import { InMemoryItemCategoryRepository } from '@infra/database/in-memory/in-memory-item-category-repository';
import faker from 'faker';
import { itemCategoryRepositoryTests } from '../common/item-category-repository-tests';

describe('In memory item category repository tests.', () => {
  const sut = InMemoryItemCategoryRepository.getInstance();
  const admin = Admin.create({
    avatar: faker.image.avatar(),
    createdAt: Date.now(),
    email: faker.internet.email(),
    id: faker.datatype.uuid(),
    name: 'Admin Tests',
    password: 'Some3PA$$word',
  }).value as Admin;

  itemCategoryRepositoryTests(sut, admin);

  it('should be a singleton.', async () => {
    const instance1 = InMemoryItemCategoryRepository.getInstance();
    const instance2 = InMemoryItemCategoryRepository.getInstance();

    expect(instance1).toBe(instance2);
  });
});

import { Admin } from '@entities/admin/admin';
import { ItemCategory } from '@entities/item-category/item-category';
import { KnexAdminRepository } from '@infra/database/knex/repositories/knex-admin-repository';
import { KnexItemCategoryRepository } from '@infra/database/knex/repositories/knex-item-category-repository';
import { KnexLocationRepository } from '@infra/database/knex/repositories/knex-location-repository';
import { setupKnexConnection } from '@infra/database/knex/setup-knex-connection';
import faker from 'faker';
import { locationRepositoryTests } from '../common/location-repository-tests';

describe('Knex location repository tests.', () => {
  const connection = setupKnexConnection('test');
  const sut = new KnexLocationRepository(connection);
  const testAdmin = Admin.create({
    avatar: faker.image.avatar(),
    createdAt: new Date(),
    email: faker.internet.email(),
    id: faker.datatype.uuid(),
    name: 'Admin Tests',
    password: 'som3Pas$word',
  }).value as Admin;

  const testCategory = ItemCategory.create({
    createdAt: Date.now(),
    creatorId: testAdmin.id.value,
    name: faker.commerce.productMaterial().concat(faker.random.alphaNumeric()),
  }).value as ItemCategory;

  beforeAll(async () => {
    await connection.migrate.latest();
    const adminRepository = new KnexAdminRepository(connection);
    const categoryRepository = new KnexItemCategoryRepository(connection);
    await adminRepository.save(testAdmin);
    await categoryRepository.save(testCategory);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  locationRepositoryTests(sut, testAdmin, testCategory);
});

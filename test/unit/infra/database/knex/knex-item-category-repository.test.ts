import { Admin } from '@entities/admin/admin';
import { KnexAdminRepository } from '@infra/database/knex/repositories/knex-admin-repository';
import { KnexItemCategoryRepository } from '@infra/database/knex/repositories/knex-item-category-repository';
import { setupKnexConnection } from '@infra/database/knex/setup-knex-connection';
import faker from 'faker';
import { itemCategoryRepositoryTests } from '../common/item-category-repository-tests';

describe('Knex item category repository tests.', () => {
  const connection = setupKnexConnection('test');
  const sut = new KnexItemCategoryRepository(connection);
  const testAdmin = Admin.create({
    avatar: faker.image.avatar(),
    createdAt: Date.now(),
    email: faker.internet.email(),
    id: faker.datatype.uuid(),
    name: 'Admin Tests',
    password: 'som3Pas$word',
  }).value as Admin;

  beforeAll(async () => {
    await connection.migrate.latest();
    const adminRepo = new KnexAdminRepository(connection);
    await adminRepo.save(testAdmin);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  itemCategoryRepositoryTests(sut, testAdmin);
});

import { KnexAdminRepository } from '@infra/database/knex/repositories/knex-admin-repository';
import { setupKnexConnection } from '@infra/database/knex/setup-knex-connection';
import { adminRepositoryTests } from '../common/admin-repository-tests';

describe('Knex admin repository tests.', () => {
  const connection = setupKnexConnection('test');
  const sut = new KnexAdminRepository(connection);

  beforeAll(async () => {
    await connection.migrate.latest();
  })

  afterAll(async () => {
    await connection.destroy();
  })

  adminRepositoryTests(sut);
});
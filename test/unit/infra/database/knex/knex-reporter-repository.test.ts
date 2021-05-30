import { KnexReporterRepository } from '@infra/database/knex/repositories/knex-reporter-repository';
import { setupKnexConnection } from '@infra/database/knex/setup-knex-connection';
import { reporterRepositoryTests } from '../common/reporter-repository-tests';

describe('Knex reporter repository tests.', () => {
  const connection = setupKnexConnection('test');
  const sut = new KnexReporterRepository(connection);

  beforeAll(async () => {
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  reporterRepositoryTests(sut);
});

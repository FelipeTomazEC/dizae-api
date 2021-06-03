import { setupKnexConnection } from '@infra/database/knex/setup-knex-connection';

export const setupEnvironment = async (): Promise<void> => {
  await setupKnexConnection(process.env.NODE_ENV).migrate.latest();
};

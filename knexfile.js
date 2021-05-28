/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
if (process.env.NODE_ENV !== 'production') require('ts-node/register');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dizae-development-db.sqlite',
    },
    pool: {
      afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb)
    },
    useNullAsDefault: true,
    migrations: {
      directory: './src/infra/database/knex/migrations',
      tableName: 'knex_migrations',
      extension: '.ts',
    },
  },

  test: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb)
    },
    migrations: {
      directory: './src/infra/database/knex/migrations',
      tableName: 'knex_migrations',
      extension: '.ts',
    },
  }
}
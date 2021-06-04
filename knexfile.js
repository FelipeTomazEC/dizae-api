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
  },

  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {rejectUnauthorized: false}
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './dist/infra/database/knex/migrations',
      tableName: 'knex_migrations',
      extension: '.js',
    },
  }
}
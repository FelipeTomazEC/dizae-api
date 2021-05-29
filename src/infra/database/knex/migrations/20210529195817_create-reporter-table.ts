import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('reporter', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.timestamp('created_at').notNullable();
    table.string('password').notNullable();
    table.string('avatar').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('reporter');
}

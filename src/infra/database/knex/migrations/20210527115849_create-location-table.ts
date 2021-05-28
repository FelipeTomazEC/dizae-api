import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('location', (table) => {
    table.uuid('id').notNullable().primary();
    table.uuid('creator_id').notNullable().references('id').inTable('admin');
    table.string('name').notNullable().unique();
    table.timestamp('created_at').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('location');
}

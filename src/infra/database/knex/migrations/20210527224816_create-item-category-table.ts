import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('item_category', (table) => {
    table.string('name').notNullable().primary();
    table.uuid('creator_id').references('id').inTable('admin');
    table.timestamp('created_at').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('item_category');
}

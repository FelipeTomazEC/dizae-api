import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('report', (table) => {
    table.uuid('id').primary();
    table.uuid('location_id').notNullable();
    table.string('item_name').notNullable();
    table.uuid('reporter_id').references('id').inTable('reporter');
    table.integer('status').notNullable();
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.timestamp('created_at').notNullable();
    table.string('image').notNullable();
    table
      .foreign(['item_name', 'location_id'])
      .references(['name', 'location_id'])
      .inTable('item');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('report');
}

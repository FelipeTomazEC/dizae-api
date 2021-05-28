import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('item', (table) => {
    table.string('name').notNullable();
    table.uuid('location_id').references('id').inTable('location');
    table.string('category_name').references('name').inTable('item_category');
    table.uuid('creator_id').references('id').inTable('admin');
    table.string('image').notNullable();
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable();
    table.primary(['name', 'location_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('item');
}

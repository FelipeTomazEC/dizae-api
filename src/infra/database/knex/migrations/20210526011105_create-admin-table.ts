import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('admin', (table) => {
    table.uuid('id').notNullable().unique().primary();
    table.string('email').notNullable().unique();
    table.string('name').notNullable();
    table.string('password').notNullable();
    table.timestamp('createdAt').notNullable();
    table.string('avatar').notNullable().defaultTo('');
  })
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('admin')
}


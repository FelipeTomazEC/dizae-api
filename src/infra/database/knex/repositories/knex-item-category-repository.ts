import { ItemCategory } from '@entities/item-category/item-category';
import { Name } from '@entities/shared/name/name';
import { ItemCategoryRepository } from '@use-cases/interfaces/repositories/item-category';
import { isNullOrUndefined } from '@utils/is-null-or-undefined';
import { Knex } from 'knex';
import { ItemCategorySchema } from '../schemas/item-category.schema';

export class KnexItemCategoryRepository implements ItemCategoryRepository {
  constructor(private readonly connection: Knex) {}

  async save(category: ItemCategory): Promise<void> {
    const exists = await this.exists(category.name);
    if (exists) {
      await this.connection<ItemCategorySchema>('item_category')
        .update({
          name: category.name.value,
        })
        .where({ name: category.name.value });
    }

    await this.connection<ItemCategorySchema>('item_category').insert({
      created_at: category.createdAt,
      creator_id: category.creatorId.value,
      name: category.name.value,
    });
  }

  async exists(name: Name): Promise<boolean> {
    const record = await this.connection<ItemCategorySchema>('item_category')
      .where({ name: name.value })
      .first();

    return !isNullOrUndefined(record);
  }

  async getAll(): Promise<ItemCategory[]> {
    const records = await this.connection<ItemCategorySchema>('item_category');

    return records.map(
      (r) =>
        ItemCategory.create({
          createdAt: new Date(r.created_at),
          creatorId: r.creator_id,
          name: r.name,
        }).value as ItemCategory,
    );
  }
}

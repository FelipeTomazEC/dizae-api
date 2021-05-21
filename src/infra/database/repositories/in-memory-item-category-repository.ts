import { ItemCategory } from '@entities/item-category/item-category';
import { Name } from '@entities/shared/name/name';
import { ItemCategoryRepository } from '@use-cases/interfaces/repositories/item-category';

export class InMemoryItemCategoryRepository implements ItemCategoryRepository {
  private static instance: InMemoryItemCategoryRepository | null = null;

  private readonly records: Map<string, ItemCategory>;

  private constructor() {
    this.records = new Map();
  }

  static getInstance(): InMemoryItemCategoryRepository {
    if (!this.instance) {
      this.instance = new InMemoryItemCategoryRepository();
    }

    return this.instance;
  }

  save(category: ItemCategory): Promise<void> {
    const key = category.name.value;
    this.records.set(key, category);
    return Promise.resolve();
  }

  exists(name: Name): Promise<boolean> {
    return Promise.resolve(this.records.has(name.value));
  }
}

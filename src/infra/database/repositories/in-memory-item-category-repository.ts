import { ItemCategory } from '@entities/item-category/item-category';
import { Name } from '@entities/shared/name/name';
import { ItemCategoryRepository } from '@use-cases/interfaces/repositories/item-category';

export class InMemoryItemCategoryRepository implements ItemCategoryRepository {
  private static instance: InMemoryItemCategoryRepository | null = null;

  private readonly records: ItemCategory[];

  private constructor() {
    this.records = [];
  }

  static getInstance(): InMemoryItemCategoryRepository {
    if (!this.instance) {
      this.instance = new InMemoryItemCategoryRepository();
    }

    return this.instance;
  }

  save(category: ItemCategory): Promise<void> {
    this.records.push(category);
    return Promise.resolve();
  }

  exists(name: Name): Promise<boolean> {
    const exists = this.records.some((r) => r.name.isEqual(name));
    return Promise.resolve(exists);
  }
}

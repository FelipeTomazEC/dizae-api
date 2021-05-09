import { ItemCategory } from '@entities/item-category/item-category';
import { Name } from '@entities/shared/name/name';

export interface ItemCategoryRepository {
  save(category: ItemCategory): Promise<void>;
  exists(name: Name): Promise<boolean>;
}

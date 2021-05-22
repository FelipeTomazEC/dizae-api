import { Timestamp } from '@entities/shared/renamed-primitive-types';

interface ItemCategoryInfo {
  name: string;
  createdAt: Timestamp;
}

export interface GetItemCategoriesResponse {
  categories: ItemCategoryInfo[];
}

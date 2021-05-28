import { Timestamp } from '@entities/shared/renamed-primitive-types';

export interface ItemCategorySchema {
  created_at: Timestamp;
  creator_id: string;
  name: string;
}

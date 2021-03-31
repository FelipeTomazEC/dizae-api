import { Timestamp } from '@entities/shared/renamed-primitive-types';

export interface ItemCategoryData {
  name: string;
  createdAt: Timestamp;
  creatorId: string;
}

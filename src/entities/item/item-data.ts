import { Timestamp, URL } from '@entities/shared/renamed-primitive-types';

export interface ItemData {
  id: string;
  name: string;
  creatorId: string;
  image: URL;
  categoryId: string;
  createdAt: Timestamp;
}

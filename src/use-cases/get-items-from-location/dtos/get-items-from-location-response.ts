import { Timestamp } from '@entities/shared/renamed-primitive-types';

interface Item {
  name: string;
  image: string;
  category: string;
  createdAt: Timestamp;
}

export type ItemCollection = Item[];

export interface GetItemsFromLocationResponse {
  items: ItemCollection;
}

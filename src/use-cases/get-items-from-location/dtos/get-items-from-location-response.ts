interface Item {
  name: string;
  image: string;
}

export type ItemCollection = Item[];

export interface GetItemsFromLocationResponse {
  items: ItemCollection;
}

import { Timestamp, URL } from '../../shared/renamed-primitive-types';

export interface ItemData {
  name: string;
  creatorId: string;
  image: URL;
  categoryName: string;
  createdAt: Timestamp;
}

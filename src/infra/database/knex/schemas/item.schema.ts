import { Timestamp, URL } from '@entities/shared/renamed-primitive-types';

export interface ItemSchema {
  name: string;
  created_at: Timestamp;
  creator_id: string;
  location_id: string;
  category_name: string;
  image: URL;
  is_deleted: boolean;
}

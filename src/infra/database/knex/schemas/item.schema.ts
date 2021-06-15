import { URL } from '@entities/shared/renamed-primitive-types';

export interface ItemSchema {
  name: string;
  created_at: Date;
  creator_id: string;
  location_id: string;
  category_name: string;
  image: URL;
  is_deleted: boolean;
}

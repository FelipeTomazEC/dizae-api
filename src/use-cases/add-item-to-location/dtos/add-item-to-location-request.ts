import { URL } from '@entities/shared/renamed-primitive-types';

export interface AddItemToLocationRequest {
  image: URL;
  categoryName: string;
  locationId: string;
  adminId: string;
  name: string;
}

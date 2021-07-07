import { Base64EncodedImage } from '@use-cases/interfaces/adapters/image-upload-service';

export interface AddItemToLocationRequest {
  image: Base64EncodedImage;
  categoryName: string;
  locationId: string;
  adminId: string;
  name: string;
}

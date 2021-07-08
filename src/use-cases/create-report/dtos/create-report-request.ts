import { Base64EncodedImage } from '@use-cases/interfaces/adapters/image-upload-service';

export interface CreateReportRequest {
  title: string;
  description: string;
  image: Base64EncodedImage;
  reporterId: string;
  locationId: string;
  itemName: string;
}

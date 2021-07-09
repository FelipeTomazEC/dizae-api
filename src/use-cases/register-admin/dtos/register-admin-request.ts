import { Base64EncodedImage } from '@use-cases/interfaces/adapters/image-upload-service';

export interface RegisterAdminRequest {
  avatar: Base64EncodedImage;
  email: string;
  name: string;
  password: string;
}

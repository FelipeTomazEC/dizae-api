import { URL } from '@entities/shared/renamed-primitive-types';

export type Base64EncodedImage = string;

export interface ImageUploadService {
  upload(encodedImage: Base64EncodedImage): Promise<URL>;
}

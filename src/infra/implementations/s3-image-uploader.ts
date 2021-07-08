import 'dotenv/config';
import { ImageUploadService } from '@use-cases/interfaces/adapters/image-upload-service';
import { S3 } from 'aws-sdk';

export class S3ImageUploader implements ImageUploadService {
  private readonly s3: AWS.S3;

  constructor(private readonly bucketName: string) {
    this.s3 = new S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
      },
    });
  }

  async upload(encodedImage: string, prefix: string): Promise<string> {
    const config: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: prefix.concat('.jpeg'),
      Body: Buffer.from(encodedImage, 'base64'),
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
    };

    const result = await this.s3.upload(config).promise();

    return result.Location;
  }
}

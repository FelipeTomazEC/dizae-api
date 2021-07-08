import { S3ImageUploader } from '@infra/implementations/s3-image-uploader';
import AWS from 'aws-sdk';
import faker from 'faker';

const generatedURL = faker.image.imageUrl();

const mockMethods = {
  upload: jest.fn().mockReturnThis(),
  promise: jest.fn().mockResolvedValue({
    Location: generatedURL,
  }),
};

jest.mock('aws-sdk', () => ({
  S3: jest.fn(() => mockMethods),
}));

describe('S3 image uploader service tests.', () => {
  const sut = new S3ImageUploader('dizae-tests');

  it('should use the upload method of the sdk.', async () => {
    await sut.upload('some-base-64-encoded-image', 'prefix');

    expect(new AWS.S3().upload).toBeCalled();
  });

  it('should upload the image and return the generated url.', async () => {
    const imageUrl = await sut.upload('some-base-64-encoded-image', 'prefix');

    expect(imageUrl).toBe(generatedURL);
  });
});

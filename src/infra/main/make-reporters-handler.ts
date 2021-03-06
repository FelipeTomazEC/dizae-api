import { KnexReporterRepository } from '@infra/database/knex/repositories/knex-reporter-repository';
import { ReportersHandler } from '@infra/express/routers/get-reporters-router';
import { BcryptPasswordEncoder } from '@infra/implementations/bcrypt-password-encoder';
import { ConsoleErrorLogger } from '@infra/implementations/console-error-logger';
import { S3ImageUploader } from '@infra/implementations/s3-image-uploader';
import { UUIDV4Generator } from '@infra/implementations/uuid-v4-generator';
import { Knex } from 'knex';
import { createRegisterReporterHandler } from '../express/handlers/create-register-reporter-handler';

export const makeReportersHandler = (connection: Knex): ReportersHandler => {
  const repository = new KnexReporterRepository(connection);
  const idGenerator = new UUIDV4Generator();
  const encoder = new BcryptPasswordEncoder();
  const logger = new ConsoleErrorLogger();
  const imageUploadService = new S3ImageUploader('dizae-images');

  const handleRegisterReporter = createRegisterReporterHandler({
    repository,
    encoder,
    idGenerator,
    logger,
    imageUploadService,
  });

  return {
    handleRegisterReporter,
  };
};

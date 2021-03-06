import { KnexAdminRepository } from '@infra/database/knex/repositories/knex-admin-repository';
import { createRegisterAdminHandler } from '@infra/express/handlers/create-register-admin-handler';
import { AdminsHandler } from '@infra/express/routers/get-admins-router';
import { BcryptPasswordEncoder } from '@infra/implementations/bcrypt-password-encoder';
import { ConsoleErrorLogger } from '@infra/implementations/console-error-logger';
import { S3ImageUploader } from '@infra/implementations/s3-image-uploader';
import { UUIDV4Generator } from '@infra/implementations/uuid-v4-generator';
import { Knex } from 'knex';

export const makeAdminsHandler = (connection: Knex): AdminsHandler => {
  const encoder = new BcryptPasswordEncoder();
  const logger = new ConsoleErrorLogger();
  const idGenerator = new UUIDV4Generator();
  const adminRepo = new KnexAdminRepository(connection);
  const imageUploadService = new S3ImageUploader('dizae-images');

  const handleRegisterAdmin = createRegisterAdminHandler({
    adminRepo,
    encoder,
    idGenerator,
    logger,
    imageUploadService,
  });

  return { handleRegisterAdmin };
};

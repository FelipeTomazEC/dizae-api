import { KnexAdminRepository } from '@infra/database/knex/repositories/knex-admin-repository';
import { KnexLocationRepository } from '@infra/database/knex/repositories/knex-location-repository';
import { KnexReportRepository } from '@infra/database/knex/repositories/knex-report-repository';
import { KnexReporterRepository } from '@infra/database/knex/repositories/knex-reporter-repository';
import { createChangeReportStatusHandler } from '@infra/express/handlers/create-change-report-status-handler';
import { createGetReportsHandler } from '@infra/express/handlers/create-get-reports-handler';
import { createReportHandler } from '@infra/express/handlers/get-create-report-handler';
import { ReportsHandler } from '@infra/express/routers/get-report-router';
import { AuthorizerComposer } from '@infra/implementations/authorizer-composer';
import { ConsoleErrorLogger } from '@infra/implementations/console-error-logger';
import { JWTAuthService } from '@infra/implementations/jwt-auth-service';
import { S3ImageUploader } from '@infra/implementations/s3-image-uploader';
import { UUIDV4Generator } from '@infra/implementations/uuid-v4-generator';
import { Knex } from 'knex';

export const makeReportsHandler = (connection: Knex): ReportsHandler => {
  const reporterAuthorizer = new JWTAuthService(
    process.env.REPORTERS_JWT_SECRET!,
  );
  const adminAuthorizer = new JWTAuthService(process.env.ADMINS_JWT_SECRET!);
  const locationRepo = new KnexLocationRepository(connection);
  const idGenerator = new UUIDV4Generator();
  const reporterRepo = new KnexReporterRepository(connection);
  const reportRepo = new KnexReportRepository(connection);
  const adminRepo = new KnexAdminRepository(connection);
  const logger = new ConsoleErrorLogger();
  const imageUploadService = new S3ImageUploader('dizae-images');

  const handleCreateReport = createReportHandler({
    authorizer: reporterAuthorizer,
    idGenerator,
    locationRepo,
    logger,
    reportRepo,
    reporterRepo,
    imageUploadService,
  });

  const handleGetReports = createGetReportsHandler({
    adminRepo,
    authorizer: new AuthorizerComposer(adminAuthorizer, reporterAuthorizer),
    locationRepo,
    logger,
    reportRepo,
    reporterRepo,
  });

  const handlePartialUpdateReport = createChangeReportStatusHandler({
    authorizer: adminAuthorizer,
    logger,
    reportGetByIdRepo: reportRepo,
    reportUpdateRepo: reportRepo,
  });

  return { handleCreateReport, handleGetReports, handlePartialUpdateReport };
};

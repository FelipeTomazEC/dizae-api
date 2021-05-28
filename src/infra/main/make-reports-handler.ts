import { InMemoryReportRepository } from '@infra/database/in-memory/in-memory-report-repository';
import { InMemoryReporterRepository } from '@infra/database/in-memory/in-memory-reporter-repository';
import { KnexAdminRepository } from '@infra/database/knex/repositories/knex-admin-repository';
import { KnexLocationRepository } from '@infra/database/knex/repositories/knex-location-repository';
import { createGetReportsHandler } from '@infra/express/handlers/create-get-reports-handler';
import { createReportHandler } from '@infra/express/handlers/get-create-report-handler';
import { ReportsHandler } from '@infra/express/routers/get-report-router';
import { AuthorizerComposer } from '@infra/implementations/authorizer-composer';
import { ConsoleErrorLogger } from '@infra/implementations/console-error-logger';
import { JWTAuthService } from '@infra/implementations/jwt-auth-service';
import { UUIDV4Generator } from '@infra/implementations/uuid-v4-generator';
import { Knex } from 'knex';

export const makeReportsHandler = (connection: Knex): ReportsHandler => {
  const reporterAuthorizer = new JWTAuthService(
    process.env.REPORTERS_JWT_SECRET!,
  );
  const adminAuthorizer = new JWTAuthService(process.env.ADMINS_JWT_SECRET!);
  const locationRepo = new KnexLocationRepository(connection);
  const idGenerator = new UUIDV4Generator();
  const reporterRepo = InMemoryReporterRepository.getInstance();
  const reportRepo = InMemoryReportRepository.getInstance();
  const adminRepo = new KnexAdminRepository(connection);
  const logger = new ConsoleErrorLogger();

  const handleCreateReport = createReportHandler({
    authorizer: reporterAuthorizer,
    idGenerator,
    locationRepo,
    logger,
    reportRepo,
    reporterRepo,
  });

  const handleGetReports = createGetReportsHandler({
    adminRepo,
    authorizer: new AuthorizerComposer(adminAuthorizer, reporterAuthorizer),
    locationRepo,
    logger,
    reportRepo,
    reporterRepo,
  });

  return { handleCreateReport, handleGetReports };
};

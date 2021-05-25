import { InMemoryAdminRepository } from '@infra/database/repositories/in-memory-admin-repository';
import { InMemoryLocationRepository } from '@infra/database/repositories/in-memory-location-repository';
import { InMemoryReportRepository } from '@infra/database/repositories/in-memory-report-repository';
import { InMemoryReporterRepository } from '@infra/database/repositories/in-memory-reporter-repository';
import { createGetReportsHandler } from '@infra/express/handlers/create-get-reports-handler';
import { createReportHandler } from '@infra/express/handlers/get-create-report-handler';
import { ReportsHandler } from '@infra/express/routers/get-report-router';
import { AuthorizerComposer } from '@infra/implementations/authorizer-composer';
import { ConsoleErrorLogger } from '@infra/implementations/console-error-logger';
import { JWTAuthService } from '@infra/implementations/jwt-auth-service';
import { UUIDV4Generator } from '@infra/implementations/uuid-v4-generator';

export const makeReportsHandler = (): ReportsHandler => {
  const reporterAuthorizer = new JWTAuthService(
    process.env.REPORTERS_JWT_SECRET!,
  );
  const adminAuthorizer = new JWTAuthService(process.env.ADMINS_JWT_SECRET!);
  const locationRepo = InMemoryLocationRepository.getInstance();
  const idGenerator = new UUIDV4Generator();
  const reporterRepo = InMemoryReporterRepository.getInstance();
  const reportRepo = InMemoryReportRepository.getInstance();
  const adminRepo = InMemoryAdminRepository.getInstance();
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

import { InMemoryLocationRepository } from '@infra/database/repositories/in-memory-location-repository';
import { InMemoryReportRepository } from '@infra/database/repositories/in-memory-report-repository';
import { InMemoryReporterRepository } from '@infra/database/repositories/in-memory-reporter-repository';
import { createReportHandler } from '@infra/express/handlers/get-create-report-handler';
import { ReportsHandler } from '@infra/express/routers/get-report-router';
import { ConsoleErrorLogger } from '@infra/implementations/console-error-logger';
import { JWTAuthService } from '@infra/implementations/jwt-auth-service';
import { UUIDV4Generator } from '@infra/implementations/uuid-v4-generator';

export const makeReportsHandler = (): ReportsHandler => {
  const authorizer = new JWTAuthService(process.env.REPORTERS_JWT_SECRET!);
  const locationRepo = InMemoryLocationRepository.getInstance();
  const idGenerator = new UUIDV4Generator();
  const reporterRepo = InMemoryReporterRepository.getInstance();
  const reportRepo = InMemoryReportRepository.getInstance();
  const logger = new ConsoleErrorLogger();

  const handleCreateReport = createReportHandler({
    authorizer,
    idGenerator,
    locationRepo,
    logger,
    reportRepo,
    reporterRepo,
  });

  return { handleCreateReport };
};

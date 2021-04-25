import { CreateReportController } from '@interface-adapters/controllers/create-report';
import { AuthorizationError } from '@interface-adapters/controllers/errors/authorization-error';
import { InternalServerError } from '@interface-adapters/controllers/errors/internal-server-error';
import { AuthorizationService } from '@interface-adapters/controllers/interfaces/authorization-service';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { getMock } from '@test/test-helpers/get-mock';
import { CreateReportUseCase } from '@use-cases/create-report/create-report';
import { CreateReportResponse } from '@use-cases/create-report/dtos/create-report-response';
import { IdGenerator } from '@use-cases/interfaces/adapters/id-generator';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import { ReportRepository } from '@use-cases/interfaces/repositories/report';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';
import faker from 'faker';

describe('Create Report Controller', () => {
  const presenter = getMock<UseCaseOutputPort<CreateReportResponse>>([
    'failure',
  ]);
  const useCase = new CreateReportUseCase({
    idGenerator: getMock<IdGenerator>([]),
    locationRepository: getMock<LocationRepository>([]),
    presenter,
    reportRepository: getMock<ReportRepository>([]),
    reporterRepository: getMock<ReporterRepository>([]),
  });
  const logger = getMock<ErrorLogger>(['log']);
  const authorizer = getMock<AuthorizationService>(['validate']);
  const sut = new CreateReportController(
    authorizer,
    logger,
    useCase,
    presenter,
  );
  const request = new HttpRequest({
    method: 'POST',
    body: {
      title: 'Some fake title',
      description: 'Some fake description here!',
      image: faker.image.image(),
      reporterId: faker.datatype.uuid(),
      itemName: faker.commerce.product(),
    },
    headers: [{ name: 'authorization', value: `Bearer some-token-here` }],
    params: [{ name: 'locationId', value: 'location-uuid' }],
  });

  beforeAll(() => {
    jest.spyOn(authorizer, 'validate').mockResolvedValue(true);
  });

  it('should not allow create reports with invalid credentials.', async () => {
    jest.spyOn(authorizer, 'validate').mockResolvedValueOnce(false);

    await sut.handle(request);

    expect(authorizer.validate).toBeCalledWith('some-token-here');
    expect(presenter.failure).toBeCalledWith(new AuthorizationError());
  });

  it('should call the use case with correct params.', async () => {
    jest.spyOn(useCase, 'execute');
    await sut.handle(request);

    expect(useCase.execute).toBeCalledWith({
      title: request.body.title,
      description: request.body.description,
      image: request.body.image,
      reporterId: request.body.reporterId,
      locationId: 'location-uuid',
      itemName: request.body.itemName,
    });
  });

  it('should pass internal errors to the logger and send them to the presenter.', async () => {
    const error = new Error('Occurred some error here. This is internal.');
    jest.spyOn(useCase, 'execute').mockRejectedValueOnce(error);

    await sut.handle(request);

    expect(logger.log).toBeCalledWith(error);
    expect(presenter.failure).toBeCalledWith(new InternalServerError());
  });
});

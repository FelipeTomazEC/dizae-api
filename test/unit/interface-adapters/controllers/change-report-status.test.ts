import { Status } from '@entities/report/status';
import { Id } from '@entities/shared/id/id';
import { ChangeReportStatusController } from '@interface-adapters/controllers/change-report-status';
import { AuthorizationError } from '@interface-adapters/controllers/errors/authorization-error';
import { InternalServerError } from '@interface-adapters/controllers/errors/internal-server-error';
import { AuthorizationService } from '@interface-adapters/controllers/interfaces/authorization-service';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { left, right } from '@shared/either.type';
import { getMock } from '@test/test-helpers/get-mock';
import { UseCaseInputPort } from '@use-cases/interfaces/ports/use-case-input-port';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import faker from 'faker';

describe('Change report status controller tests.', () => {
  const authService = getMock<AuthorizationService>(['validate']);
  const logger = getMock<ErrorLogger>(['log']);
  const useCase = getMock<UseCaseInputPort<any>>(['execute']);
  const presenter = getMock<UseCaseOutputPort<any>>(['failure']);
  const sut = new ChangeReportStatusController(
    authService,
    logger,
    useCase,
    presenter,
  );
  const request = new HttpRequest({
    method: 'PATCH',
    headers: [{ name: 'authorization', value: 'Bearer some-token' }],
    params: [{ name: 'report_id', value: 'some-uuid' }],
    body: {
      status: Status.SOLVED,
    },
  });

  beforeAll(() => {
    const adminId = Id.create({ value: faker.datatype.uuid() }).value as Id;
    jest.spyOn(authService, 'validate').mockResolvedValue(right(adminId));
  });

  it('should parse the request and pass it to the use case.', async () => {
    await sut.handle(request);

    expect(useCase.execute).toBeCalledWith({
      reportId: 'some-uuid',
      newStatus: Status.SOLVED,
    });
  });

  it('should not allow unauthenticated admins access.', async () => {
    const error = new AuthorizationError();
    jest.spyOn(authService, 'validate').mockResolvedValueOnce(left(error));
    await sut.handle(request);

    expect(presenter.failure).toBeCalledWith(error);
  });

  it('should log and present internal errors.', async () => {
    const error = new Error('Unexpected error in use case.');
    jest.spyOn(useCase, 'execute').mockRejectedValueOnce(error);
    await sut.handle(request);

    expect(logger.log).toBeCalledWith(error);
    expect(presenter.failure).toBeCalledWith(new InternalServerError());
  });

  it('should validate the credentials.', async () => {
    await sut.handle(request);

    expect(authService.validate).toBeCalledWith('some-token');
  });
});

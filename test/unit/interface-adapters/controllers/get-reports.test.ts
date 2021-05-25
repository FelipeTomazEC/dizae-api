import { Status } from '@entities/report/status';
import { Id } from '@entities/shared/id/id';
import { AuthorizationError } from '@interface-adapters/controllers/errors/authorization-error';
import { InternalServerError } from '@interface-adapters/controllers/errors/internal-server-error';
import { GetReportsController } from '@interface-adapters/controllers/get-reports';
import { AuthorizationService } from '@interface-adapters/controllers/interfaces/authorization-service';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { left, right } from '@shared/either.type';
import { getMock } from '@test/test-helpers/get-mock';
import { GetReportsRequest } from '@use-cases/get-reports/dtos/get-reports-request';
import { GetReportsUseCase } from '@use-cases/get-reports/get-reports';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import faker from 'faker';

describe('Get reports controller tests.', () => {
  const authorizer = getMock<AuthorizationService>(['validate']);
  const presenter = getMock<UseCaseOutputPort<any>>(['failure']);
  const useCase = getMock<GetReportsUseCase>(['execute']);
  const logger = getMock<ErrorLogger>(['log']);
  const sut = new GetReportsController(authorizer, logger, useCase, presenter);
  const requesterId = Id.create({ value: faker.datatype.uuid() }).value as Id;
  const request = new HttpRequest({
    method: 'GET',
    query: [
      { name: 'locations_ids', value: 'location1, location2' },
      { name: 'status', value: '1,2,3' },
      { name: 'since', value: 124566547 },
      { name: 'item_categories', value: 'Infra, Tech, Others' },
      { name: 'start', value: 30 },
      { name: 'offset', value: 40 },
    ],
    headers: [{ name: 'authorization', value: 'Bearer some-user-token' }],
  });

  beforeAll(() => {
    jest.spyOn(authorizer, 'validate').mockResolvedValue(right(requesterId));
  });

  it('should parse the request to a get reports use case request.', async () => {
    const useCaseRequest: GetReportsRequest = {
      requesterId: requesterId.value,
      itemCategories: ['Infra', 'Tech', 'Others'],
      locationsIds: ['location1', 'location2'],
      since: 124566547,
      pagination: {
        offset: 40,
        start: 30,
      },
      status: [1, 2, 3],
    };
    await sut.handle(request);

    expect(useCase.execute).toBeCalledWith(useCaseRequest);
  });

  it('should block unauthenticated users access.', async () => {
    const error = new AuthorizationError();
    jest.spyOn(authorizer, 'validate').mockResolvedValueOnce(left(error));

    await sut.handle(request);

    expect(presenter.failure).toBeCalledWith(error);
  });

  it('should remove not valid status from the request.', async () => {
    const requestWithInvalidStatus = new HttpRequest({
      method: 'GET',
      query: [{ name: 'status', value: '1,2,3,4,invalid' }],
      headers: [{ name: 'authorization', value: 'Bearer token' }],
    });

    await sut.handle(requestWithInvalidStatus);

    expect(useCase.execute).toBeCalledWith({
      requesterId: requesterId.value,
      status: [Status.PENDING, Status.REJECTED, Status.SOLVED],
      pagination: {
        start: 0,
        offset: 50,
      },
    });
  });

  it('should not send the param since if it is invalid.', async () => {
    const requestWithInvalidTimestamp = new HttpRequest({
      method: 'GET',
      query: [{ name: 'since', value: 'not-timestamp' }],
      headers: [{ name: 'authorization', value: 'Bearer token' }],
    });

    await sut.handle(requestWithInvalidTimestamp);

    expect(useCase.execute).toBeCalledWith({
      requesterId: requesterId.value,
      pagination: {
        start: 0,
        offset: 50,
      },
    });
  });

  it('should log and send to the presenter internal server errors.', async () => {
    const error = new Error('Some internal error here.');
    jest.spyOn(useCase, 'execute').mockRejectedValueOnce(error);

    await sut.handle(request);

    expect(presenter.failure).toBeCalledWith(new InternalServerError());
    expect(logger.log).toBeCalledWith(error);
  });
});

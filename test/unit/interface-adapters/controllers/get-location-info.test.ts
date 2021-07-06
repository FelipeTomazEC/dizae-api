import { InternalServerError } from '@interface-adapters/controllers/errors/internal-server-error';
import { GetLocationInfoController } from '@interface-adapters/controllers/get-location-info';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { getMock } from '@test/test-helpers/get-mock';
import { GetLocationInfoUseCase } from '@use-cases/get-location-info/get-location-info';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';

describe('Get items from location controller tests.', () => {
  const logger = getMock<ErrorLogger>(['log']);
  const presenter = getMock<UseCaseOutputPort<any>>(['failure']);
  const useCase = getMock<GetLocationInfoUseCase>(['execute']);
  const sut = new GetLocationInfoController(logger, useCase, presenter);

  const request = new HttpRequest({
    method: 'GET',
    params: [{ name: 'location_id', value: 'some-location-id' }],
  });

  it('should get the location id and pass it to the use case.', async () => {
    await sut.handle(request);

    expect(useCase.execute).toBeCalledWith({ locationId: 'some-location-id' });
  });

  it('should log internal errors and send them to the presenter.', async () => {
    const error = new Error('Some internal error message.');
    jest.spyOn(useCase, 'execute').mockRejectedValueOnce(error);

    await sut.handle(request);

    expect(logger.log).toBeCalledWith(error);
    expect(presenter.failure).toBeCalledWith(new InternalServerError());
  });
});

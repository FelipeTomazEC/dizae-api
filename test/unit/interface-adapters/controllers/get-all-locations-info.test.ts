import { InternalServerError } from '@interface-adapters/controllers/errors/internal-server-error';
import { GetAllLocationsInfoController } from '@interface-adapters/controllers/get-all-locations-info';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { getMock } from '@test/test-helpers/get-mock';
import { GetAllLocationsInfoUseCase } from '@use-cases/get-all-locations-info/get-all-locations-info';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';

describe('Get all locations controller tests.', () => {
  const logger = getMock<ErrorLogger>(['log']);
  const presenter = getMock<UseCaseOutputPort<any>>(['failure']);
  const useCase = getMock<GetAllLocationsInfoUseCase>(['execute']);
  const sut = new GetAllLocationsInfoController(logger, useCase, presenter);
  const request = new HttpRequest({
    method: 'GET',
  });

  it('should call the use case.', async () => {
    await sut.handle(request);

    expect(useCase.execute).toBeCalled();
  });

  it('should log and send to the presenter internal errors.', async () => {
    const error = new Error('Some internal error.');
    jest.spyOn(useCase, 'execute').mockRejectedValueOnce(error);
    await sut.handle(request);

    expect(presenter.failure).toBeCalledWith(new InternalServerError());
    expect(logger.log).toBeCalledWith(error);
  });
});

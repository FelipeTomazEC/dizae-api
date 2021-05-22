import { InternalServerError } from '@interface-adapters/controllers/errors/internal-server-error';
import { GetItemCategoriesController } from '@interface-adapters/controllers/get-item-categories';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { getMock } from '@test/test-helpers/get-mock';
import { GetItemCategoriesUseCase } from '@use-cases/get-item-categories/get-item-categories';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';

describe('Get item categories controller tests.', () => {
  const logger = getMock<ErrorLogger>(['log']);
  const presenter = getMock<UseCaseOutputPort<any>>(['failure']);
  const useCase = getMock<GetItemCategoriesUseCase>(['execute']);
  const sut = new GetItemCategoriesController(logger, useCase, presenter);
  const request = new HttpRequest({ method: 'GET' });

  it('should call the use case.', async () => {
    await sut.handle(request);

    expect(useCase.execute).toBeCalled();
  });

  it('should log and return internal errors.', async () => {
    const error = new Error('Internal error here.');
    jest.spyOn(useCase, 'execute').mockRejectedValueOnce(error);

    await sut.handle(request);

    expect(logger.log).toBeCalledWith(error);
    expect(presenter.failure).toBeCalledWith(new InternalServerError());
  });
});

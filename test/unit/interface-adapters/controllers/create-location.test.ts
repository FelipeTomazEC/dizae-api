import { CreateLocationController } from '@interface-adapters/controllers/create-location';
import { AuthorizationError } from '@interface-adapters/controllers/errors/authorization-error';
import { InternalServerError } from '@interface-adapters/controllers/errors/internal-server-error';
import { AuthorizationService } from '@interface-adapters/controllers/interfaces/authorization-service';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { getMock } from '@test/test-helpers/get-mock';
import { CreateLocationUseCase } from '@use-cases/create-location/create-location';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import faker from 'faker';

describe('Create location controller tests.', () => {
  const logger = getMock<ErrorLogger>(['log']);
  const presenter = getMock<UseCaseOutputPort<any>>(['failure']);
  const useCase = getMock<CreateLocationUseCase>(['execute']);
  const authService = getMock<AuthorizationService>(['validate']);
  const sut = new CreateLocationController(
    authService,
    logger,
    useCase,
    presenter,
  );

  const request = new HttpRequest({
    method: 'POST',
    body: {
      adminId: faker.datatype.uuid(),
      name: faker.commerce.department(),
    },
    headers: [
      {
        name: 'authorization',
        value: 'Bearer some-token-here',
      },
    ],
  });

  beforeAll(() => {
    jest.spyOn(authService, 'validate').mockResolvedValue(true);
  });

  it('should parse the http request and pass it through the use case.', async () => {
    await sut.handle(request);

    expect(useCase.execute).toBeCalledWith({
      adminId: request.body.adminId,
      name: request.body.name,
    });
  });

  it('should not allow the access to unauthenticated/ admins.', async () => {
    jest.spyOn(authService, 'validate').mockResolvedValueOnce(false);
    await sut.handle(request);

    expect(presenter.failure).toBeCalledWith(new AuthorizationError());
  });

  it('should log and inform internal server errors.', async () => {
    const error = new Error('Occurred an error here!');
    jest.spyOn(useCase, 'execute').mockRejectedValueOnce(error);

    await sut.handle(request);

    expect(presenter.failure).toBeCalledWith(new InternalServerError());
    expect(logger.log).toBeCalledWith(error);
  });
});

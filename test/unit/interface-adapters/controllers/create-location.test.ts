import { Id } from '@entities/shared/id/id';
import { CreateLocationController } from '@interface-adapters/controllers/create-location';
import { AuthorizationError } from '@interface-adapters/controllers/errors/authorization-error';
import { InternalServerError } from '@interface-adapters/controllers/errors/internal-server-error';
import { AuthorizationService } from '@interface-adapters/controllers/interfaces/authorization-service';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { left, right } from '@shared/either.type';
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
      name: faker.commerce.department(),
    },
    headers: [
      {
        name: 'authorization',
        value: 'Bearer some-token-here',
      },
    ],
  });

  const adminId = Id.create({ value: faker.datatype.uuid() }).value as Id;

  beforeAll(() => {
    jest.spyOn(authService, 'validate').mockResolvedValue(right(adminId));
  });

  it('should parse the http request and pass it through the use case.', async () => {
    await sut.handle(request);

    expect(useCase.execute).toBeCalledWith({
      adminId: adminId.value,
      name: request.body.name,
    });
  });

  it('should not allow the access to unauthenticated/ admins.', async () => {
    const error = new AuthorizationError();
    jest.spyOn(authService, 'validate').mockResolvedValueOnce(left(error));
    await sut.handle(request);

    expect(presenter.failure).toBeCalledWith(error);
  });

  it('should log and inform internal server errors.', async () => {
    const error = new Error('Occurred an error here!');
    jest.spyOn(useCase, 'execute').mockRejectedValueOnce(error);

    await sut.handle(request);

    expect(presenter.failure).toBeCalledWith(new InternalServerError());
    expect(logger.log).toBeCalledWith(error);
  });

  it('should pass the credentials to the authorizer.', async () => {
    await sut.handle(request);

    expect(authService.validate).toBeCalledWith('some-token-here');
  });
});

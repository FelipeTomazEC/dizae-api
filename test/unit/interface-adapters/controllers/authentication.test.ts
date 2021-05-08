import { AuthenticationController } from '@interface-adapters/controllers/authentication';
import { InternalServerError } from '@interface-adapters/controllers/errors/internal-server-error';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { getMock } from '@test/test-helpers/get-mock';
import { AuthenticateReporterUseCase } from '@use-cases/authenticate-reporter/authenticate-reporter';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import faker from 'faker';

describe('Authentication controller tests.', () => {
  const useCase = getMock<AuthenticateReporterUseCase>(['execute']);
  const presenter = getMock<UseCaseOutputPort<any>>(['failure']);
  const logger = getMock<ErrorLogger>(['log']);
  const sut = new AuthenticationController(logger, useCase, presenter);
  const request = new HttpRequest({
    method: 'POST',
    body: {
      email: faker.internet.email(),
      password: faker.internet.password(),
    },
  });

  it('should get the params from the request and pass it through the use case.', async () => {
    await sut.handle(request);

    expect(useCase.execute).toBeCalledWith({
      email: request.body.email,
      password: request.body.password,
    });
  });

  it('should log internal errors and send a internal server error to the presenter.', async () => {
    const error = new Error('Ops! Occurred an unexpected error here.');
    jest.spyOn(useCase, 'execute').mockRejectedValueOnce(error);

    await sut.handle(request);

    expect(presenter.failure).toBeCalledWith(new InternalServerError());
    expect(logger.log).toBeCalledWith(error);
  });
});

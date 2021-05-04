import { InternalServerError } from '@interface-adapters/controllers/errors/internal-server-error';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { RegisterAdminController } from '@interface-adapters/controllers/register-admin';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { getMock } from '@test/test-helpers/get-mock';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { RegisterAdminUseCase } from '@use-cases/register-admin/register-admin';
import faker from 'faker';

describe('Register admin controller tests.', () => {
  const presenter = getMock<UseCaseOutputPort<any>>(['failure']);
  const logger = getMock<ErrorLogger>(['log']);
  const useCase = getMock<RegisterAdminUseCase>(['execute']);
  const sut = new RegisterAdminController(logger, useCase, presenter);

  const httpRequest = new HttpRequest({
    method: 'POST',
    body: {
      avatar: faker.internet.avatar(),
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    },
  });

  it('should parse the http request and send it to the use case.', async () => {
    await sut.handle(httpRequest);

    expect(useCase.execute).toBeCalledWith({
      avatar: httpRequest.body.avatar,
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  it('should log internal errors and send it to the presenter.', async () => {
    const error = new Error('Occurred some error when executing the use case.');
    jest.spyOn(useCase, 'execute').mockRejectedValueOnce(error);

    await sut.handle(httpRequest);

    expect(presenter.failure).toBeCalledWith(new InternalServerError());
    expect(logger.log).toBeCalledWith(error);
  });
});

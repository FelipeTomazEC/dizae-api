import { InternalServerError } from '@interface-adapters/controllers/errors/internal-server-error';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { RegisterReporterController } from '@interface-adapters/controllers/register-reporter';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { getMock } from '@test/test-helpers/get-mock';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { RegisterReporterUseCase } from '@use-cases/register-reporter/register-reporter';
import faker from 'faker';

describe('Register reporter controller tests.', () => {
  const useCase = getMock<RegisterReporterUseCase>(['execute']);
  const presenter = getMock<UseCaseOutputPort<any>>(['failure']);
  const logger = getMock<ErrorLogger>(['log']);
  const sut = new RegisterReporterController(logger, useCase, presenter);

  const request = new HttpRequest({
    method: 'POST',
    body: {
      name: faker.name.findName(),
      avatar: faker.image.avatar(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    },
  });

  it('should parse the http request and pass it to the use case.', async () => {
    await sut.handle(request);

    expect(useCase.execute).toBeCalledWith({
      name: request.body.name,
      avatar: request.body.avatar,
      email: request.body.email,
      password: request.body.password,
    });
  });

  it('should log internal errors and send it to the presenter.', async () => {
    const error = new Error('Some strange error occurred here.');
    jest.spyOn(useCase, 'execute').mockRejectedValueOnce(error);
    await sut.handle(request);

    expect(presenter.failure).toBeCalledWith(new InternalServerError());
    expect(logger.log).toBeCalledWith(error);
  });
});

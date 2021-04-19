import { Reporter } from '@entities/reporter/reporter';
import { Email } from '@entities/shared/email/email';
import { Password } from '@entities/shared/password/password';
import { left } from '@shared/either.type';
import { getMock } from '@test/test-helpers/get-mock';
import { AuthenticateReporterUseCase } from '@use-cases/authenticate-reporter/authenticate-reporter';
import { AuthenticateReporterRequest } from '@use-cases/authenticate-reporter/dtos/authenticate-reporter-request';
import { AuthenticateReporterResponse } from '@use-cases/authenticate-reporter/dtos/authenticate-reporter-response';
import { IncorrectEmailOrPasswordError } from '@use-cases/authenticate-reporter/errors/incorrect-email-or-password-error';
import { ReporterNotRegisteredError } from '@use-cases/authenticate-reporter/errors/reporter-not-registered-error';
import { PasswordEncoder } from '@use-cases/interfaces/adapters/password-encoder';
import { ReporterAuthService } from '@use-cases/interfaces/adapters/reporter-auth-service';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';
import * as faker from 'faker';

describe('Authenticate reporter use case tests.', () => {
  const repository = getMock<ReporterRepository>(['getReporterByEmail']);
  const encoder = getMock<PasswordEncoder>(['verify']);
  const authService = getMock<ReporterAuthService>(['generateCredentials']);
  const presenter = getMock<UseCaseOutputPort<AuthenticateReporterResponse>>([
    'failure',
    'success',
  ]);
  const sut = new AuthenticateReporterUseCase({
    authService,
    encoder,
    presenter,
    repository,
  });

  const request: AuthenticateReporterRequest = {
    email: 'reporter@email.com',
    password: 's0m3P@$$word',
  };

  beforeAll(() => {
    const reporter = Reporter.create({
      id: faker.datatype.uuid(),
      name: faker.name.firstName(),
      password: '$om3pAssword',
      email: faker.internet.email(),
      createdAt: Date.now(),
      avatar: faker.internet.avatar(),
    }).value as Reporter;

    jest.spyOn(repository, 'getReporterByEmail').mockResolvedValue(reporter);
  });

  it('should not authenticate with invalid passwords.', async () => {
    jest.spyOn(Password, 'create').mockReturnValueOnce(left(new Error()));

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(
      new IncorrectEmailOrPasswordError(),
    );
  });

  it('should not authenticate with invalid e-mails.', async () => {
    jest.spyOn(Email, 'create').mockReturnValueOnce(left(new Error()));

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(
      new IncorrectEmailOrPasswordError(),
    );
  });

  it('should not authenticate with wrong passwords.', async () => {
    jest.spyOn(encoder, 'verify').mockResolvedValueOnce(false);

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(
      new IncorrectEmailOrPasswordError(),
    );
  });

  it('should inform if the reporter is not registered.', async () => {
    jest
      .spyOn(repository, 'getReporterByEmail')
      .mockResolvedValueOnce(undefined);
    const email = Email.create({ value: request.email }).value as Email;
    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(
      new ReporterNotRegisteredError(email),
    );
  });

  it('should send a token when password and the e-mail are correct.', async () => {
    jest.spyOn(encoder, 'verify').mockResolvedValueOnce(true);
    jest
      .spyOn(authService, 'generateCredentials')
      .mockResolvedValueOnce('some-crazy-token');

    await sut.execute(request);

    expect(presenter.success).toBeCalledWith({
      credentials: 'some-crazy-token',
      expiresIn: AuthenticateReporterUseCase.CREDENTIALS_TTL_IN_SECONDS,
    });
  });
});

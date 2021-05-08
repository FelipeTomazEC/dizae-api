import { Reporter } from '@entities/reporter/reporter';
import { Email } from '@entities/shared/email/email';
import { Password } from '@entities/shared/password/password';
import { left } from '@shared/either.type';
import { getMock } from '@test/test-helpers/get-mock';
import { AuthenticateReporterUseCase } from '@use-cases/authenticate-reporter/authenticate-reporter';
import { ReporterNotRegisteredError } from '@use-cases/authenticate-reporter/errors/reporter-not-registered-error';
import { PasswordEncoder } from '@use-cases/interfaces/adapters/password-encoder';
import { AuthenticationService } from '@use-cases/interfaces/adapters/authentication-service';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';
import * as faker from 'faker';
import { AuthenticationResponse } from '@use-cases/shared/dtos/authentication-response';
import { AuthenticationRequest } from '@use-cases/shared/dtos/authentication-request';
import { IncorrectPasswordError } from '@use-cases/shared/errors/incorrect-password-error';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { InvalidEmailError } from '@entities/shared/email/errors/invalid-email-error';

describe('Authenticate reporter use case tests.', () => {
  const repository = getMock<ReporterRepository>(['getReporterByEmail']);
  const encoder = getMock<PasswordEncoder>(['verify']);
  const authService = getMock<AuthenticationService<Reporter>>([
    'generateCredentials',
  ]);
  const presenter = getMock<UseCaseOutputPort<AuthenticationResponse>>([
    'failure',
    'success',
  ]);
  const sut = new AuthenticateReporterUseCase({
    authService,
    encoder,
    presenter,
    repository,
  });

  const request: AuthenticationRequest = {
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

    expect(presenter.failure).toBeCalledWith(new IncorrectPasswordError());
  });

  it('should not authenticate with invalid e-mails.', async () => {
    await sut.execute({ ...request, email: 'invalid-email' });

    expect(presenter.failure).toBeCalledWith(
      new InvalidParamError('email', new InvalidEmailError('invalid-email')),
    );
  });

  it('should not authenticate with wrong passwords.', async () => {
    jest.spyOn(encoder, 'verify').mockResolvedValueOnce(false);

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(new IncorrectPasswordError());
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

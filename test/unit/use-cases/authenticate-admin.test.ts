import { Admin } from '@entities/admin/admin';
import { Email } from '@entities/shared/email/email';
import { InvalidEmailError } from '@entities/shared/email/errors/invalid-email-error';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { getMock } from '@test/test-helpers/get-mock';
import { AuthenticateAdminUseCase } from '@use-cases/authenticate-admin/authenticate-admin';
import { AuthenticateAdminRequest as Request } from '@use-cases/authenticate-admin/dtos/authenticate-admin-request';
import { AuthenticateAdminResponse as Response } from '@use-cases/authenticate-admin/dtos/authenticate-admin-response';
import { AdminNotRegisteredError } from '@use-cases/authenticate-admin/errors/admin-not-registered-error';
import { IncorrectEmailOrPasswordError } from '@use-cases/authenticate-reporter/errors/incorrect-email-or-password-error';
import { AuthenticationService } from '@use-cases/interfaces/adapters/authentication-service';
import { PasswordEncoder } from '@use-cases/interfaces/adapters/password-encoder';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';
import faker from 'faker';

describe('Authenticate admin use case tests.', () => {
  const repository = getMock<AdminRepository>(['getByEmail']);
  const presenter = getMock<UseCaseOutputPort<Response>>([
    'failure',
    'success',
  ]);
  const encoder = getMock<PasswordEncoder>(['verify']);
  const authService = getMock<AuthenticationService<Admin>>([
    'generateCredentials',
  ]);
  const sut = new AuthenticateAdminUseCase({
    repository,
    presenter,
    encoder,
    authService,
  });

  const request: Request = {
    email: faker.internet.email(),
    password: 'som3#pass$worD',
  };

  beforeAll(() => {
    const admin = Admin.create({
      avatar: faker.internet.avatar(),
      createdAt: Date.now(),
      email: request.email,
      id: faker.datatype.uuid(),
      name: faker.name.findName(),
      password: request.password,
    }).value as Admin;

    jest.spyOn(repository, 'getByEmail').mockResolvedValue(admin);
    jest.spyOn(encoder, 'verify').mockResolvedValue(true);
  });

  it('should not authenticate with invalid e-mails.', async () => {
    await sut.execute({ ...request, email: 'invalid.email.com' });

    expect(presenter.failure).toBeCalledWith(
      new InvalidParamError(
        'email',
        new InvalidEmailError('invalid.email.com'),
      ),
    );
  });

  it('should inform if the e-mail is not registered.', async () => {
    jest.spyOn(repository, 'getByEmail').mockResolvedValueOnce(undefined);
    const email = Email.create({ value: request.email }).value as Email;

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(
      new AdminNotRegisteredError(email),
    );
  });

  it('should not authenticate with invalid password.', async () => {
    await sut.execute({ ...request, password: 'inva' });

    expect(presenter.failure).toBeCalledWith(
      new IncorrectEmailOrPasswordError(),
    );
  });

  it('should not authenticate with a wrong password.', async () => {
    jest.spyOn(encoder, 'verify').mockResolvedValueOnce(false);

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(
      new IncorrectEmailOrPasswordError(),
    );
  });

  it('should generate a token and send it to the presenter.', async () => {
    const token = 'some-admin-token-here@@@@';
    jest.spyOn(authService, 'generateCredentials').mockResolvedValueOnce(token);
    await sut.execute(request);

    expect(presenter.success).toBeCalledWith({
      credentials: token,
      expiresIn: 3600,
    });
  });
});

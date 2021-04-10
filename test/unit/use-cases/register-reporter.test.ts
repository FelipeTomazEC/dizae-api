import { Password } from '@entities/shared/password/password';
import faker from 'faker';
import { Reporter } from '@entities/reporter/reporter';
import { Id } from '@entities/shared/id/id';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { NullValueError } from '@entities/shared/errors/null-value-error';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';
import { PasswordEncoder } from '@use-cases/interfaces/adapters/password-encoder';
import { IdGenerator } from '@use-cases/interfaces/adapters/id-generator';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { EmailAlreadyRegisteredError } from '@use-cases/shared/errors/email-already-registered-error';
import { Email } from '@entities/shared/email/email';
import { RegisterReporterUseCase } from '@use-cases/register-reporter/register-reporter';
import { RegisterReporterRequest } from '@use-cases/register-reporter/dtos/register-reporter-request';
import { left } from '@shared/either.type';
import { getMock } from '../../test-helpers/get-mock';

describe('Register Reporter use case tests.', () => {
  const repository = getMock<ReporterRepository>(['emailExists', 'save']);
  const encoder = getMock<PasswordEncoder>(['encode']);
  const idGenerator = getMock<IdGenerator>(['generate']);
  const presenter = getMock<UseCaseOutputPort<any>>(['failure', 'success']);

  beforeAll(() => {
    const id = Id.create({ value: faker.random.uuid() }).value as Id;
    jest.spyOn(idGenerator, 'generate').mockReturnValue(id);
  });

  const sut = new RegisterReporterUseCase({
    repository,
    encoder,
    idGenerator,
    presenter,
  });

  const request: RegisterReporterRequest = {
    email: faker.internet.email(),
    password: 'SomePassword15@',
    avatar: faker.internet.avatar(),
    name: faker.name.findName(),
  };

  it('should register only an unregistered email.', async () => {
    jest.spyOn(repository, 'emailExists').mockResolvedValueOnce(true);
    const email = Email.create({ value: request.email }).value as Email;

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(
      new EmailAlreadyRegisteredError(email),
    );
  });

  it('should encrypt the password before saving the user.', async () => {
    const createdAt = Date.now();
    const id = Id.create({ value: faker.random.uuid() }).value as Id;
    const encodedPassword = Password.create({ value: '3nc0DedP@$$word' })
      .value as Password;
    jest.spyOn(Date, 'now').mockReturnValueOnce(createdAt);
    jest.spyOn(idGenerator, 'generate').mockReturnValueOnce(id);
    jest.spyOn(encoder, 'encode').mockReturnValueOnce(encodedPassword);

    const reporter = Reporter.create({
      email: request.email,
      name: request.name,
      avatar: request.avatar,
      id: id.value,
      password: encodedPassword.value,
      createdAt,
    }).value as Reporter;

    await sut.execute(request);

    expect(repository.save).toBeCalledWith(reporter);
  });

  it('should pass any validation errors through the failure method of the presenter.', async () => {
    const error = new InvalidParamError('property', new NullValueError());
    jest.spyOn(Reporter, 'create').mockReturnValueOnce(left(error));

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(error);
  });

  it(`should return the new reporter's id.`, async () => {
    const id = Id.create({ value: faker.random.uuid() }).value as Id;
    jest.spyOn(idGenerator, 'generate').mockReturnValueOnce(id);

    await sut.execute(request);

    expect(presenter.success).toBeCalledWith({ reporterId: id.value });
  });
});

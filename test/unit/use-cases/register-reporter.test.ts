import { Reporter } from '@entities/reporter/reporter';
import { Email } from '@entities/shared/email/email';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { NullValueError } from '@entities/shared/errors/null-value-error';
import { Id } from '@entities/shared/id/id';
import { Password } from '@entities/shared/password/password';
import { left } from '@shared/either.type';
import { IdGenerator } from '@use-cases/interfaces/adapters/id-generator';
import { ImageUploadService } from '@use-cases/interfaces/adapters/image-upload-service';
import { PasswordEncoder } from '@use-cases/interfaces/adapters/password-encoder';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';
import { RegisterReporterRequest } from '@use-cases/register-reporter/dtos/register-reporter-request';
import { RegisterReporterUseCase } from '@use-cases/register-reporter/register-reporter';
import { EmailAlreadyRegisteredError } from '@use-cases/shared/errors/email-already-registered-error';
import faker from 'faker';
import { getMock } from '../../test-helpers/get-mock';

describe('Register Reporter use case tests.', () => {
  const repository = getMock<ReporterRepository>(['emailExists', 'save']);
  const encoder = getMock<PasswordEncoder>(['encode']);
  const idGenerator = getMock<IdGenerator>(['generate']);
  const presenter = getMock<UseCaseOutputPort<any>>(['failure', 'success']);
  const imageUploadService = getMock<ImageUploadService>(['upload']);

  const sut = new RegisterReporterUseCase({
    repository,
    encoder,
    idGenerator,
    presenter,
    imageUploadService,
  });

  const request: RegisterReporterRequest = {
    email: faker.internet.email(),
    password: 'SomePassword15@',
    avatar: 'some-base-64-image',
    name: faker.name.findName(),
  };

  const avatarURL = faker.image.imageUrl();
  const id = Id.create({ value: faker.datatype.uuid() }).value as Id;

  beforeAll(() => {
    jest.spyOn(idGenerator, 'generate').mockReturnValue(id);
    jest.spyOn(imageUploadService, 'upload').mockResolvedValue(avatarURL);
  });

  it('should register only an unregistered email.', async () => {
    jest.spyOn(repository, 'emailExists').mockResolvedValueOnce(true);
    const email = Email.create({ value: request.email }).value as Email;

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(
      new EmailAlreadyRegisteredError(email),
    );
  });

  it('should encrypt the password before saving the user.', async () => {
    const password = Password.create({ value: request.password })
      .value as Password;

    await sut.execute(request);

    expect(encoder.encode).toBeCalledWith(password);
    expect(repository.save).toBeCalled();
  });

  it('should pass any validation errors through the failure method of the presenter.', async () => {
    const error = new InvalidParamError('property', new NullValueError());
    jest.spyOn(Reporter, 'create').mockReturnValueOnce(left(error));

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(error);
  });

  it('should upload the avatar using the image upload service', async () => {
    await sut.execute(request);

    expect(imageUploadService.upload).toBeCalledWith(request.avatar, id.value);
  });

  it(`should return the new reporter's id and their avatar url.`, async () => {
    await sut.execute(request);

    expect(presenter.success).toBeCalledWith({
      reporterId: id.value,
      avatar: avatarURL,
    });
  });
});

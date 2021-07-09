import { Admin } from '@entities/admin/admin';
import { Email } from '@entities/shared/email/email';
import { InvalidEmailError } from '@entities/shared/email/errors/invalid-email-error';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { Id } from '@entities/shared/id/id';
import { Password } from '@entities/shared/password/password';
import { left } from '@shared/either.type';
import { getMock } from '@test/test-helpers/get-mock';
import { IdGenerator } from '@use-cases/interfaces/adapters/id-generator';
import { ImageUploadService } from '@use-cases/interfaces/adapters/image-upload-service';
import { PasswordEncoder } from '@use-cases/interfaces/adapters/password-encoder';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';
import { RegisterAdminRequest } from '@use-cases/register-admin/dtos/register-admin-request';
import { RegisterAdminResponse } from '@use-cases/register-admin/dtos/register-admin-response';
import { RegisterAdminUseCase } from '@use-cases/register-admin/register-admin';
import { EmailAlreadyRegisteredError } from '@use-cases/shared/errors/email-already-registered-error';
import faker from 'faker';

describe('Register admin use case tests.', () => {
  const adminRepo = getMock<AdminRepository>(['emailExists', 'save']);
  const presenter = getMock<UseCaseOutputPort<RegisterAdminResponse>>([
    'failure',
    'success',
  ]);
  const encoder = getMock<PasswordEncoder>(['encode']);
  const idGenerator = getMock<IdGenerator>(['generate']);
  const imageUploadService = getMock<ImageUploadService>(['upload']);
  const sut = new RegisterAdminUseCase({
    imageUploadService,
    adminRepo,
    encoder,
    idGenerator,
    presenter,
  });

  const id = Id.create({ value: faker.datatype.uuid() }).value as Id;
  const avatarURL = faker.image.imageUrl();
  const encodedPassword = Password.create({ value: '3enc0dedPas#$word' })
    .value as Password;

  beforeAll(() => {
    jest.spyOn(idGenerator, 'generate').mockReturnValue(id);
    jest.spyOn(encoder, 'encode').mockReturnValue(encodedPassword);
    jest.spyOn(Date, 'now').mockReturnValue(Date.now());
    jest.spyOn(imageUploadService, 'upload').mockResolvedValue(avatarURL);
  });

  const request: RegisterAdminRequest = {
    avatar: 'some-base64-encoded-image',
    email: faker.internet.email(),
    password: 'som3#password',
    name: faker.name.findName(),
  };

  it('should not register an already registered e-mails.', async () => {
    jest.spyOn(adminRepo, 'emailExists').mockResolvedValueOnce(true);
    const email = Email.create({ value: request.email }).value as Email;

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(
      new EmailAlreadyRegisteredError(email),
    );
  });

  it('should send the id and the avatar to the presenter.', async () => {
    await sut.execute(request);

    expect(adminRepo.save).toBeCalled();
    expect(presenter.success).toBeCalledWith({
      adminId: id.value,
      avatar: avatarURL,
    });
  });

  it('should pass entity creation errors through the presenter.', async () => {
    const invalidEmail = 'invalid.email.com';
    const error = new InvalidParamError(
      'email',
      new InvalidEmailError(invalidEmail),
    );
    jest.spyOn(Admin, 'create').mockReturnValueOnce(left(error));

    await sut.execute({ ...request, email: invalidEmail });

    expect(presenter.failure).toBeCalledWith(error);
  });

  it('should encrypt the password before saving.', async () => {
    const password = Password.create({ value: request.password })
      .value as Password;

    await sut.execute(request);

    expect(encoder.encode).toBeCalledWith(password);
  });

  it('should upload the avatar using the image upload service', async () => {
    await sut.execute(request);

    expect(imageUploadService.upload).toBeCalledWith(request.avatar, id.value);
  });
});

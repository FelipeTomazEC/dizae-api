import { Reporter } from '@entities/reporter/reporter';
import { Id } from '@entities/shared/id/id';
import { JWTAuthService } from '@infra/implementations/jwt-auth-service';
import { AuthorizationError } from '@interface-adapters/controllers/errors/authorization-error';
import faker from 'faker';

describe('JWT auth service implementation tests', () => {
  const sut = new JWTAuthService('my-jwt-secret');

  const reporter = Reporter.create({
    avatar: faker.internet.avatar(),
    createdAt: new Date(),
    email: faker.internet.email(),
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    password: 'some-p@$$w0rD',
  }).value as Reporter;

  test('It should get an user and generate a json web token.', async () => {
    const credentials = await sut.generateCredentials(reporter, 3600);

    expect(credentials).toBeTruthy();
  });

  test('It should return an error to invalid tokens.', async () => {
    const ownerIdOrError = await sut.validate('invalid-token');

    expect(ownerIdOrError.isLeft()).toBe(true);
    expect(ownerIdOrError.value).toStrictEqual(new AuthorizationError());
  });

  test('It should return the id of the owner to valid tokens.', async () => {
    const credentials = await sut.generateCredentials(reporter, 3600);
    const ownerIdOrError = await sut.validate(credentials);

    expect(ownerIdOrError.isRight()).toBe(true);
    expect(ownerIdOrError.value).toBeInstanceOf(Id);
    expect(ownerIdOrError.value).toStrictEqual(reporter.id);
  });

  test('It should return false to expired tokens.', async () => {
    const credentials = await sut.generateCredentials(reporter, 0);
    const ownerIdOrError = await sut.validate(credentials);

    expect(ownerIdOrError.isLeft()).toBe(true);
    expect(ownerIdOrError.value).toStrictEqual(new AuthorizationError());
  });
});

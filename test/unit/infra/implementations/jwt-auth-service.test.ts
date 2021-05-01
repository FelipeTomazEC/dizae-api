import { Reporter } from '@entities/reporter/reporter';
import { JWTAuthService } from '@infra/implementations/jwt-auth-service';
import faker from 'faker';

describe('JWT auth service implementation tests', () => {
  const sut = new JWTAuthService('my-jwt-secret');

  const reporter = Reporter.create({
    avatar: faker.internet.avatar(),
    createdAt: Date.now(),
    email: faker.internet.email(),
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    password: 'some-p@$$w0rD',
  }).value as Reporter;

  test('It should get an user and generate a json web token.', async () => {
    const credentials = await sut.generateCredentials(reporter, 3600);

    expect(credentials).toBeTruthy();
  });

  test('It should return false to invalid tokens.', async () => {
    const isValidToken = await sut.validate('invalid-token');

    expect(isValidToken).toBeFalsy();
  });

  test('It should return true to valid tokens.', async () => {
    const credentials = await sut.generateCredentials(reporter, 3600);
    const isValidToken = await sut.validate(credentials);

    expect(isValidToken).toBeTruthy();
  });

  test('It should return false to expired tokens.', async () => {
    const credentials = await sut.generateCredentials(reporter, 0);
    const isValidToken = await sut.validate(credentials);

    expect(isValidToken).toBeFalsy();
  });
});

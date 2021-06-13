import { Admin } from '@entities/admin/admin';
import { Reporter } from '@entities/reporter/reporter';
import { AuthorizerComposer } from '@infra/implementations/authorizer-composer';
import { JWTAuthService } from '@infra/implementations/jwt-auth-service';
import { AuthorizationError } from '@interface-adapters/controllers/errors/authorization-error';
import { AuthorizationService } from '@interface-adapters/controllers/interfaces/authorization-service';
import { left } from '@shared/either.type';
import { getMock } from '@test/test-helpers/get-mock';
import faker from 'faker';

describe('Authorizer composer tests.', () => {
  const authorizer1 = new JWTAuthService('secret1');
  const authorizer2 = new JWTAuthService('secret2');
  const authorizer3 = getMock<AuthorizationService>(['validate']);
  const sut = new AuthorizerComposer(authorizer1, authorizer2, authorizer3);
  let reporter: Reporter;
  let admin: Admin;

  beforeAll(async () => {
    reporter = Reporter.create({
      avatar: faker.image.avatar(),
      createdAt: Date.now(),
      email: faker.internet.email(),
      id: faker.datatype.uuid(),
      name: 'Reporter Name',
      password: 'some-p4$$word',
    }).value as Reporter;

    admin = Admin.create({
      avatar: faker.image.avatar(),
      createdAt: new Date(),
      email: faker.internet.email(),
      id: faker.datatype.uuid(),
      name: 'Admin Name',
      password: 'some-pass$24d',
    }).value as Admin;

    jest
      .spyOn(authorizer3, 'validate')
      .mockResolvedValue(left(new AuthorizationError()));
  });

  it('should return the owner id if some authorizer recognize the credentials.', async () => {
    const reporterToken = await authorizer1.generateCredentials(reporter);
    const adminToken = await authorizer2.generateCredentials(admin);
    const response1 = await sut.validate(reporterToken);
    const response2 = await sut.validate(adminToken);

    expect(response1.isRight()).toBe(true);
    expect(response2.isRight()).toBe(true);
    expect(response1.value).toStrictEqual(reporter.id);
    expect(response2.value).toStrictEqual(admin.id);
  });

  it('should return an error if the credential are not valid.', async () => {
    const response = await sut.validate('some-credentials');

    expect(response.isLeft()).toBe(true);
    expect(response.value).toStrictEqual(new AuthorizationError());
  });
});

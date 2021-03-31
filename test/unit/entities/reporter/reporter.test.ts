import * as faker from 'faker';
import { getObjectWithNullProperty } from '@test/test-helpers/get-object-with-null-property';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { ReporterData } from '@entities/reporter/reporter-data';
import { Reporter } from '@entities/reporter/reporter';

describe('Reporter entity tests.', () => {
  const example: ReporterData = {
    id: faker.random.uuid(),
    name: faker.name.findName(),
    createdAt: Date.now(),
    email: faker.internet.email(),
    password: faker.internet.password().concat('6'),
    avatar: faker.internet.avatar(),
  };

  const getReporterDataWithNullProp = getObjectWithNullProperty(example);

  it('should have a valid name.', () => {
    const data = getReporterDataWithNullProp('name');
    const reporterOrError = Reporter.create(data);

    expect(reporterOrError.isLeft()).toBeTruthy();
  });

  it('should have a valid password.', () => {
    const data = getReporterDataWithNullProp('password');
    const reporterOrError = Reporter.create(data);

    expect(reporterOrError.isLeft());
  });

  it('should have a valid e-mail.', () => {
    const data = getReporterDataWithNullProp('email');
    const reporterOrError = Reporter.create(data);

    expect(reporterOrError.isLeft()).toBeTruthy();
  });

  it('should have an avatar.', () => {
    const data = getReporterDataWithNullProp('avatar');
    const reporterOrError = Reporter.create(data);

    expect(reporterOrError.isLeft()).toBeTruthy();
    expect(reporterOrError.value).toStrictEqual(
      new MissingParamError('avatar'),
    );
  });

  it('should have an id.', () => {
    const data = getReporterDataWithNullProp('id');
    const reporterOrError = Reporter.create(data);

    expect(reporterOrError.isLeft()).toBeTruthy();
  });

  it('should have a creation date.', () => {
    const data = getReporterDataWithNullProp('createdAt');
    const reporterOrError = Reporter.create(data);

    expect(reporterOrError.isLeft()).toBeTruthy();
    expect(reporterOrError.value).toStrictEqual(
      new MissingParamError('createdAt'),
    );
  });

  it('should create an reporter instance.', () => {
    const reporterOrError = Reporter.create(example);
    const reporter: Reporter = reporterOrError.value as Reporter;

    expect(reporterOrError.isRight()).toBeTruthy();
    expect(reporter).toBeInstanceOf(Reporter);
    expect(reporter.id.value).toBe(example.id);
    expect(reporter.email.value).toBe(example.email);
    expect(reporter.password.value).toBe(example.password);
    expect(reporter.avatar).toBe(example.avatar);
    expect(reporter.name.value).toBe(example.name);
    expect(reporter.createdAt).toBe(example.createdAt);
  });
});

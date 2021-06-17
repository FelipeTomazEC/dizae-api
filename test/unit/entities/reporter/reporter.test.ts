import { Reporter } from '@entities/reporter/reporter';
import { ReporterData } from '@entities/reporter/reporter-data';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { NullValueError } from '@entities/shared/errors/null-value-error';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { getObjectWithNullProperty } from '@test/test-helpers/get-object-with-null-property';
import * as faker from 'faker';

describe('Reporter entity tests.', () => {
  const example: ReporterData = {
    id: faker.datatype.uuid(),
    name: 'User Tester',
    createdAt: new Date(),
    email: faker.internet.email(),
    password: faker.internet.password().concat('6'),
    avatar: faker.internet.avatar(),
  };

  const getReporterDataWithNullProp = getObjectWithNullProperty(example);

  it('should have a valid name.', () => {
    const data = getReporterDataWithNullProp('name');
    const reporterOrError = Reporter.create(data);

    expect(reporterOrError.isLeft()).toBeTruthy();
    expect(reporterOrError.value).toStrictEqual(
      new InvalidParamError('name', new NullValueError()),
    );
  });

  it('should have a valid password.', () => {
    const data = getReporterDataWithNullProp('password');
    const reporterOrError = Reporter.create(data);

    expect(reporterOrError.isLeft());
    expect(reporterOrError.value).toStrictEqual(
      new InvalidParamError('password', new NullValueError()),
    );
  });

  it('should have a valid e-mail.', () => {
    const data = getReporterDataWithNullProp('email');
    const reporterOrError = Reporter.create(data);

    expect(reporterOrError.isLeft()).toBeTruthy();
    expect(reporterOrError.value).toStrictEqual(
      new InvalidParamError('email', new NullValueError()),
    );
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
    expect(reporterOrError.value).toStrictEqual(
      new InvalidParamError('id', new NullValueError()),
    );
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

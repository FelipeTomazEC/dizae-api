import { AdminData } from '@entities/admin/admin-data';
import { Email } from '@entities/shared/email/email';
import { left } from '@shared/either.type';
import * as faker from 'faker';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { Id } from '@entities/shared/id/id';
import { Admin } from '@entities/admin/admin';
import { Name } from '@entities/shared/name/name';
import { Password } from '@entities/shared/password/password';
import { getObjectWithNullProperty } from '@test/test-helpers/get-object-with-null-property';
import { NullValueError } from '@entities/shared/errors/null-value-error';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';

describe('Admin entity tests.', () => {
  const example: AdminData = {
    avatar: faker.internet.avatar(),
    createdAt: Date.now(),
    email: faker.internet.email(),
    id: faker.random.uuid(),
    name: faker.name.findName(),
    password: faker.internet.password(15, false),
  };

  const getAdminDataWithNullProperty = getObjectWithNullProperty(example);

  it('should have a valid name.', () => {
    jest.spyOn(Name, 'create').mockReturnValueOnce(left(new NullValueError()));
    const data = getAdminDataWithNullProperty('name');
    const adminOrError = Admin.create(data);

    expect(adminOrError.isLeft()).toBe(true);
    expect(adminOrError.value).toStrictEqual(
      new InvalidParamError('name', new NullValueError()),
    );
  });

  it('should have a valid password.', () => {
    jest
      .spyOn(Password, 'create')
      .mockReturnValueOnce(left(new NullValueError()));
    const data = getAdminDataWithNullProperty('password');
    const adminOrError = Admin.create(data);

    expect(adminOrError.isLeft()).toBeTruthy();
    expect(adminOrError.value).toStrictEqual(
      new InvalidParamError('password', new NullValueError()),
    );
  });

  it('should have a valid e-mail.', () => {
    jest.spyOn(Email, 'create').mockReturnValueOnce(left(new NullValueError()));
    const data = getAdminDataWithNullProperty('email');
    const adminOrError = Admin.create(data);

    expect(adminOrError.isLeft()).toBeTruthy();
    expect(adminOrError.value).toStrictEqual(
      new InvalidParamError('email', new NullValueError()),
    );
  });

  it('should have an avatar.', () => {
    const data = getAdminDataWithNullProperty('avatar');
    const adminOrError = Admin.create(data);

    expect(adminOrError.isLeft()).toBeTruthy();
    expect(adminOrError.value).toStrictEqual(new MissingParamError('avatar'));
  });

  it('should have a createdAt property.', () => {
    const data = getAdminDataWithNullProperty('createdAt');
    const adminOrError = Admin.create(data);

    expect(adminOrError.isLeft()).toBeTruthy();
    expect(adminOrError.value).toStrictEqual(
      new MissingParamError('createdAt'),
    );
  });

  it('should have a valid id.', () => {
    jest.spyOn(Id, 'create').mockReturnValueOnce(left(new NullValueError()));
    const data = getAdminDataWithNullProperty('id');
    const adminOrError = Admin.create(data);

    expect(adminOrError.isLeft()).toBeTruthy();
    expect(adminOrError.value).toStrictEqual(
      new InvalidParamError('id', new NullValueError()),
    );
  });

  it('should create an admin instance.', () => {
    const adminOrError = Admin.create(example);
    const admin = adminOrError.value as Admin;

    expect(adminOrError.isRight()).toBeTruthy();
    expect(admin).toBeInstanceOf(Admin);
    expect(admin.name.value).toBe(example.name);
    expect(admin.id.value).toBe(example.id);
    expect(admin.avatar).toBe(example.avatar);
    expect(admin.createdAt).toBe(example.createdAt);
    expect(admin.email.value).toBe(example.email);
    expect(admin.password.value).toBe(example.password);
  });
});

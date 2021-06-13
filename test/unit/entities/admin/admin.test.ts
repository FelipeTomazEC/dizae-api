import { Admin } from '@entities/admin/admin';
import { AdminData } from '@entities/admin/admin-data';
import { Email } from '@entities/shared/email/email';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { NullValueError } from '@entities/shared/errors/null-value-error';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { Password } from '@entities/shared/password/password';
import { left } from '@shared/either.type';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { getObjectWithNullProperty } from '@test/test-helpers/get-object-with-null-property';
import * as faker from 'faker';

describe('Admin entity tests.', () => {
  const example: AdminData = {
    avatar: faker.internet.avatar(),
    createdAt: new Date(),
    email: faker.internet.email(),
    id: faker.datatype.uuid(),
    name: 'Test User Name',
    password: 'Some-$tr4nge_Pa$$0rd',
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
    expect(admin.createdAt).toStrictEqual(example.createdAt);
    expect(admin.email.value).toBe(example.email);
    expect(admin.password.value).toBe(example.password);
  });

  it('should change the password of the admin to the new value.', () => {
    const admin = Admin.create(example).value as Admin;
    const newPassword = Password.create({ value: 'n3wPassword' })
      .value as Password;

    expect(admin.password.value).toBe(example.password);

    admin.password = newPassword;

    expect(admin.password.value).toBe('n3wPassword');
  });
});

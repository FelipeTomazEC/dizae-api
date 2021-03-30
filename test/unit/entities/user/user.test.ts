import * as faker from 'faker';
import { getObjectWithNullProperty } from '@test/test-helpers/get-object-with-null-property';
import { UserData } from '@entities/user/user-data';
import { User } from '@entities/user/user';
import { MissingParamError } from '@shared/errors/missing-param-error';

describe('User entity tests.', () => {
  const example: UserData = {
    id: faker.random.uuid(),
    name: faker.name.findName(),
    createdAt: Date.now(),
    email: faker.internet.email(),
    password: faker.internet.password().concat('6'),
    avatar: faker.internet.avatar(),
  };

  const getUserDataWithNullProp = getObjectWithNullProperty(example);

  it('should have a valid name.', () => {
    const data = getUserDataWithNullProp('name');
    const userOrError = User.create(data);

    expect(userOrError.isLeft()).toBeTruthy();
  });

  it('should have a valid password.', () => {
    const data = getUserDataWithNullProp('password');
    const userOrError = User.create(data);

    expect(userOrError.isLeft());
  });

  it('should have a valid e-mail.', () => {
    const data = getUserDataWithNullProp('email');
    const userOrError = User.create(data);

    expect(userOrError.isLeft()).toBeTruthy();
  });

  it('should have an avatar.', () => {
    const data = getUserDataWithNullProp('avatar');
    const userOrError = User.create(data);

    expect(userOrError.isLeft()).toBeTruthy();
    expect(userOrError.value).toStrictEqual(new MissingParamError('avatar'));
  });

  it('should have an id.', () => {
    const data = getUserDataWithNullProp('id');
    const userOrError = User.create(data);

    expect(userOrError.isLeft()).toBeTruthy();
  });

  it('should have a creation date.', () => {
    const data = getUserDataWithNullProp('createdAt');
    const userOrError = User.create(data);

    expect(userOrError.isLeft()).toBeTruthy();
    expect(userOrError.value).toStrictEqual(new MissingParamError('createdAt'));
  });

  it('should create an user instance.', () => {
    const userOrError = User.create(example);
    const user: User = userOrError.value as User;

    expect(userOrError.isRight()).toBeTruthy();
    expect(user).toBeInstanceOf(User);
    expect(user.id.value).toBe(example.id);
    expect(user.email.value).toBe(example.email);
    expect(user.password.value).toBe(example.password);
    expect(user.avatar).toBe(example.avatar);
    expect(user.name.value).toBe(example.name);
    expect(user.createdAt).toBe(example.createdAt);
  });
});

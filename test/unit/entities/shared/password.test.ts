import { MissingParamError } from '@shared/errors/missing-param-error';
import { Password } from '@entities/shared/password/password';
import { PasswordWithoutNumericCharError } from '@entities/shared/password/errors/password-without-numeric-char-error';
import * as faker from 'faker';
import { PasswordLengthError } from '@entities/shared/password/errors/password-length-error';

describe('Password value object tests.', () => {
  it('should not be undefined/null.', () => {
    const value: any = undefined;
    const passwordOrError = Password.create({ value });

    expect(passwordOrError.isLeft()).toBeTruthy();
    expect(passwordOrError.value).toStrictEqual(
      new MissingParamError('password'),
    );
  });

  it('should have at least 1 numeric character.', () => {
    const passwordOrError = Password.create({ value: 'no-numeric-char' });

    expect(passwordOrError.isLeft()).toBeTruthy();
    expect(passwordOrError.value).toStrictEqual(
      new PasswordWithoutNumericCharError(),
    );
  });

  it('should have a minimum number of characters.', () => {
    const { MINIMUM_LENGTH } = Password;
    const value = faker.internet.password(MINIMUM_LENGTH - 1);
    const passwordOrError = Password.create({ value });

    expect(passwordOrError.isLeft()).toBeTruthy();
    expect(passwordOrError.value).toStrictEqual(
      new PasswordLengthError(MINIMUM_LENGTH),
    );
  });

  it('should create a password value object.', () => {
    const length = Password.MINIMUM_LENGTH - 1;
    const value = faker.internet.password(length).concat('2');
    const passwordOrError = Password.create({ value });
    const password = passwordOrError.value as Password;

    expect(passwordOrError.isRight()).toBeTruthy();
    expect(password).toBeInstanceOf(Password);
    expect(password.value).toBe(value);
  });
});

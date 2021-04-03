import { InvalidEmailError } from '@entities/shared/email/errors/invalid-email-error';
import { Email } from '@entities/shared/email/email';
import { NullValueError } from '@entities/shared/errors/null-value-error';

describe('Email value object tests.', () => {
  it('should not be null/undefined.', () => {
    const value: any = undefined;
    const emailOrError = Email.create({ value });

    expect(emailOrError.isLeft()).toBeTruthy();
    expect(emailOrError.value).toStrictEqual(new NullValueError());
  });

  it('should have one occurrence of @ character.', () => {
    const value = 'example.email.com';
    const emailOrError = Email.create({ value });

    expect(emailOrError.isLeft()).toBeTruthy();
    expect(emailOrError.value).toStrictEqual(new InvalidEmailError(value));
  });

  it('should have only one @ character.', () => {
    const value = 'ex@mple@email.com';
    const emailOrError = Email.create({ value });

    expect(emailOrError.isLeft()).toBeTruthy();
    expect(emailOrError.value).toStrictEqual(new InvalidEmailError(value));
  });

  test('None of the special characters in this local-part are allowed outside quotation marks', () => {
    const value = 'a"b(c)d,e:f;g<h>i[j\\k]l@example.com';
    const emailOrError = Email.create({ value });

    expect(emailOrError.isLeft()).toBeTruthy();
    expect(emailOrError.value).toStrictEqual(new InvalidEmailError(value));
  });

  test('Quoted strings must be dot separated or the only element making up the local-part', () => {
    const value = 'just"not"right@example.com';
    const emailOrError = Email.create({ value });

    expect(emailOrError.isLeft()).toBeTruthy();
    expect(emailOrError.value).toStrictEqual(new InvalidEmailError(value));
  });

  test('Local part must be shorter than 64 characters', () => {
    const value =
      '1234567890123456789012345678901234567890123456789012345678901234+x@example.com';
    const emailOrError = Email.create({ value });

    expect(emailOrError.isLeft()).toBeTruthy();
    expect(emailOrError.value).toStrictEqual(new InvalidEmailError(value));
  });

  it('should not have quoted double dot', () => {
    const value = 'john..dot@example.com';
    const emailOrError = Email.create({ value });

    expect(emailOrError.isLeft()).toBeTruthy();
    expect(emailOrError.value).toStrictEqual(new InvalidEmailError(value));
  });

  it('should create an email.', () => {
    const value = 'user@email.com';
    const emailOrError = Email.create({ value });
    const email = emailOrError.value as Email;

    expect(emailOrError.isRight()).toBeTruthy();
    expect(email).toBeInstanceOf(Email);
    expect(email.value).toBe(value);
  });
});

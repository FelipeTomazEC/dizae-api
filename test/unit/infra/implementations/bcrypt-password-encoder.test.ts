import { Password } from '@entities/shared/password/password';
import { BcryptPasswordEncoder } from '@infra/implementations/bcrypt-password-encoder';

describe('Bcrypt password encoder tests.', () => {
  const encoder = new BcryptPasswordEncoder();

  test('It should encode the given password.', () => {
    const password = Password.create({ value: 'some-passWord1' })
      .value as Password;
    const encoded = encoder.encode(password);

    expect(encoded.isEqual(password)).toBeFalsy();
  });

  test('Even equals passwords must be encoded differently.', () => {
    const password = Password.create({ value: 'some-passworD1' })
      .value as Password;
    const encoded1 = encoder.encode(password);
    const encoded2 = encoder.encode(password);

    expect(encoded1.isEqual(encoded2)).toBeFalsy();
  });

  test('It should be able to verify if a password is the seed of the hash.', () => {
    const password = Password.create({ value: 'some-passworD1' })
      .value as Password;
    const other = Password.create({ value: 'not-the-passworD1' })
      .value as Password;
    const encoded = encoder.encode(password);

    expect(encoder.verify(password, encoded)).resolves.toBeTruthy();
    expect(encoder.verify(other, encoded)).resolves.toBeFalsy();
  });
});

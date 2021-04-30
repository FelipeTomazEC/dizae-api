import { Password } from '@entities/shared/password/password';
import { PasswordEncoder } from '@use-cases/interfaces/adapters/password-encoder';
import { hashSync, compare } from 'bcrypt';

export class BcryptPasswordEncoder implements PasswordEncoder {
  private static readonly SALT_ROUNDS: number = 10;

  encode(password: Password): Password {
    const encodedValue = hashSync(
      password.value,
      BcryptPasswordEncoder.SALT_ROUNDS,
    );

    return Password.create({ value: encodedValue }).value as Password;
  }

  verify(password: Password, encoded: Password): Promise<boolean> {
    return compare(password.value, encoded.value);
  }
}

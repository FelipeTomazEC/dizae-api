import { Password } from '@entities/shared/password/password';

export interface PasswordEncoder {
  encode(password: Password): Password;
  verify(password: Password, encoded: Password): Promise<boolean>;
}

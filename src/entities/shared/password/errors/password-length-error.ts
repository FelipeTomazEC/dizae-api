import { ValueObjectError } from '@entities/shared/errors/value-object-error';

export class PasswordLengthError extends ValueObjectError {
  constructor(minLength: number) {
    super(`A password should have at least ${minLength} characters.`);
  }
}

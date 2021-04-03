import { ValueObjectError } from '@entities/shared/errors/value-object-error';

export class PasswordWithoutNumericCharError extends ValueObjectError {
  constructor() {
    super('A password must have at least 1 numeric character.');
  }
}

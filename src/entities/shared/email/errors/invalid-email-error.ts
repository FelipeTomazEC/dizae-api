import { ValueObjectError } from '@entities/shared/errors/value-object-error';

export class InvalidEmailError extends ValueObjectError {
  constructor(value: string) {
    super(`${value} is not a valid e-mail.`);
  }
}

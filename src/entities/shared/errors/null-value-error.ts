import { ValueObjectError } from '@entities/shared/errors/value-object-error';

export class NullValueError extends ValueObjectError {
  constructor() {
    super(`Value cannot be null or undefined.`);
  }
}

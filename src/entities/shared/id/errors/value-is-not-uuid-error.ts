import { ValueObjectError } from '@entities/shared/errors/value-object-error';

export class ValueIsNotUUIDError extends ValueObjectError {
  constructor(value: string) {
    super(`${value} is not a valid uuid.`);
  }
}

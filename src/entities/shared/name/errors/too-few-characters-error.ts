import { ValueObjectError } from '@entities/shared/errors/value-object-error';

export class TooFewCharactersError extends ValueObjectError {
  constructor() {
    super(`The name must have at least 2 characters.`);
  }
}

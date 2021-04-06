import { ValueObjectError } from '@entities/shared/errors/value-object-error';

export class TooLongDescriptionError extends ValueObjectError {
  constructor(maxLength: number) {
    super(`A description cannot have more than ${maxLength} characters.`);
  }
}

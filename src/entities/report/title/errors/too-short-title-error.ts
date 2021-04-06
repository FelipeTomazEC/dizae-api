import { ValueObjectError } from '@entities/shared/errors/value-object-error';

export class TooShortTitleError extends ValueObjectError {
  constructor(minLength: number) {
    super(`A title must have at least ${minLength} characters.`);
  }
}

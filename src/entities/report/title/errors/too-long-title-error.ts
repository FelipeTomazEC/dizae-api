import { ValueObjectError } from '@entities/shared/errors/value-object-error';

export class TooLongTitleError extends ValueObjectError {
  constructor(maxLength: number) {
    super(`A title cannot have more than ${maxLength} characters.`);
  }
}

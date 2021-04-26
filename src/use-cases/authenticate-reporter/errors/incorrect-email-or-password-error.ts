import { BaseError } from '@shared/errors/base-error';
import { ErrorType } from '@shared/errors/error-type.enum';

export class IncorrectEmailOrPasswordError extends BaseError {
  constructor() {
    super(ErrorType.INVALID_INPUT_ERROR, `Incorrect e-mail or password.`);
  }
}

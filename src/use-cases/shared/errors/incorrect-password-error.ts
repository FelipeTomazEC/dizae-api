import { BaseError } from '@shared/errors/base-error';
import { ErrorType } from '@shared/errors/error-type.enum';

export class IncorrectPasswordError extends BaseError {
  constructor() {
    super(ErrorType.AUTHENTICATION_ERROR, `Incorrect Password.`);
  }
}

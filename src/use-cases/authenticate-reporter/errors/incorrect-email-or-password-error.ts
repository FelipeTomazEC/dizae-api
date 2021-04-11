import { BaseError } from '@shared/errors/base-error';
import { ErrorCode } from '@shared/errors/error-code.enum';

export class IncorrectEmailOrPasswordError extends BaseError {
  constructor() {
    super(ErrorCode.AUTHENTICATION_ERROR, `Incorrect e-mail or password.`);
  }
}

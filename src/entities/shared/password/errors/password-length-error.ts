import { BaseError } from '@shared/errors/base-error';
import { ErrorCode } from '@shared/errors/error-code.enum';

export class PasswordLengthError extends BaseError {
  constructor(minLength: number) {
    super(
      ErrorCode.INVALID_PARAM_VALUE,
      `A password should have at least ${minLength} characters.`,
    );
  }
}

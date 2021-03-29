import { BaseError } from '@shared/errors/base-error';
import { ErrorCode } from '@shared/errors/error-code.enum';

export class PasswordWithoutNumericCharError extends BaseError {
  constructor() {
    super(
      ErrorCode.INVALID_PARAM_VALUE,
      'A password must have at least 1 numeric character.',
    );
  }
}

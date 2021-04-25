import { BaseError } from '@shared/errors/base-error';
import { ErrorCode } from '@shared/errors/error-code.enum';

export class AuthorizationError extends BaseError {
  constructor() {
    super(ErrorCode.AUTHORIZATION_ERROR, 'Invalid or expired credentials.');
  }
}

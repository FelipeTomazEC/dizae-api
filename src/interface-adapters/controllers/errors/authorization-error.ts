import { BaseError } from '@shared/errors/base-error';
import { ErrorType } from '@shared/errors/error-type.enum';

export class AuthorizationError extends BaseError {
  constructor() {
    super(ErrorType.AUTHORIZATION_ERROR, 'Invalid or expired credentials.');
  }
}

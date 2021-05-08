import { Email } from '@entities/shared/email/email';
import { BaseError } from '@shared/errors/base-error';
import { ErrorType } from '@shared/errors/error-type.enum';

export class AdminNotRegisteredError extends BaseError {
  constructor(email: Email) {
    super(
      ErrorType.RESOURCE_NOT_FOUND_ERROR,
      `Admin ${email.value} is not registered.`,
    );
  }
}

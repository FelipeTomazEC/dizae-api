import { BaseError } from '@shared/errors/base-error';
import { Email } from '@entities/shared/email/email';
import { ErrorType } from '@shared/errors/error-type.enum';

export class ReporterNotRegisteredError extends BaseError {
  constructor(email: Email) {
    super(
      ErrorType.RESOURCE_NOT_FOUND_ERROR,
      `E-mail ${email.value} is not registered.`,
    );
  }
}

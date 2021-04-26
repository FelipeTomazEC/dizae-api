import { BaseError } from '@shared/errors/base-error';
import { Email } from '@entities/shared/email/email';
import { ErrorType } from '@shared/errors/error-type.enum';

export class EmailAlreadyRegisteredError extends BaseError {
  constructor(email: Email) {
    super(
      ErrorType.DUPLICATED_RESOURCE,
      `E-mail ${email.value} is already registered.`,
    );
  }
}

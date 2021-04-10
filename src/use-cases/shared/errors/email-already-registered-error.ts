import { BaseError } from '@shared/errors/base-error';
import { Email } from '@entities/shared/email/email';
import { ErrorCode } from '@shared/errors/error-code.enum';

export class EmailAlreadyRegisteredError extends BaseError {
  constructor(email: Email) {
    super(
      ErrorCode.RESOURCE_ALREADY_EXISTS,
      `E-mail ${email.value} is already registered.`,
    );
  }
}

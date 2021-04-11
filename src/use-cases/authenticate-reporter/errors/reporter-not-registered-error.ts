import { BaseError } from '@shared/errors/base-error';
import { Email } from '@entities/shared/email/email';
import { ErrorCode } from '@shared/errors/error-code.enum';

export class ReporterNotRegisteredError extends BaseError {
  constructor(email: Email) {
    super(ErrorCode.NOT_REGISTERED, `E-mail ${email.value} is not registered.`);
  }
}

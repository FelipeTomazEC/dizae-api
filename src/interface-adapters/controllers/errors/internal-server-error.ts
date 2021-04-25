import { BaseError } from '@shared/errors/base-error';
import { ErrorCode } from '@shared/errors/error-code.enum';

export class InternalServerError extends BaseError {
  constructor() {
    super(ErrorCode.INTERNAL_SERVER_ERROR, `Occurred an error on the server.`);
  }
}

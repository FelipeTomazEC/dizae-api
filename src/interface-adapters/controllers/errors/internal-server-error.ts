import { BaseError } from '@shared/errors/base-error';
import { ErrorType } from '@shared/errors/error-type.enum';

export class InternalServerError extends BaseError {
  constructor() {
    super(ErrorType.INTERNAL_SERVER_ERROR, `Occurred an error on the server.`);
  }
}

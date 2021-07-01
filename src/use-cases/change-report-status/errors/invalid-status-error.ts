import { BaseError } from '@shared/errors/base-error';
import { ErrorType } from '@shared/errors/error-type.enum';

export class InvalidStatusError extends BaseError {
  constructor() {
    super(
      ErrorType.INVALID_INPUT_ERROR,
      'The informed value is not a valid report status.',
    );
  }
}

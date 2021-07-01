import { BaseError } from '@shared/errors/base-error';
import { ErrorType } from '@shared/errors/error-type.enum';

export class ReportNotFoundError extends BaseError {
  constructor() {
    super(
      ErrorType.RESOURCE_NOT_FOUND_ERROR,
      'The informed report was not found.',
    );
  }
}

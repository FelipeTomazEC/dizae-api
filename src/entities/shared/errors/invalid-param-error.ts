import { BaseError } from '@shared/errors/base-error';
import { ValueObjectError } from '@entities/shared/errors/value-object-error';
import { ErrorType } from '@shared/errors/error-type.enum';

export class InvalidParamError extends BaseError {
  constructor(paramName: string, detailedError: ValueObjectError) {
    super(
      ErrorType.INVALID_INPUT_ERROR,
      `Invalid ${paramName} value.`,
      detailedError.message,
    );
  }
}

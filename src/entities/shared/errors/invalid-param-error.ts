import { BaseError } from '@shared/errors/base-error';
import { ErrorCode } from '@shared/errors/error-code.enum';
import { ValueObjectError } from '@entities/shared/errors/value-object-error';

export class InvalidParamError extends BaseError {
  constructor(paramName: string, detailedError: ValueObjectError) {
    super(
      ErrorCode.INVALID_PARAM_VALUE,
      `Invalid ${paramName} value.`,
      detailedError.message,
    );
  }
}

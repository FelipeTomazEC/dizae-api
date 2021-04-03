import { BaseError } from '@shared/errors/base-error';
import { ErrorCode } from '@shared/errors/error-code.enum';

export class InvalidParamError extends BaseError {
  constructor(paramName: string, details: string) {
    super(
      ErrorCode.INVALID_PARAM_VALUE,
      `Invalid ${paramName} value.`,
      details,
    );
  }
}

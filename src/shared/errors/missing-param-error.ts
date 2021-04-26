import { BaseError } from './base-error';
import { ErrorType } from './error-type.enum';

export class MissingParamError extends BaseError {
  constructor(paramName: string) {
    super(
      ErrorType.MISSING_REQUIRED_PARAM,
      `The param ${paramName} is required.`,
    );
  }
}

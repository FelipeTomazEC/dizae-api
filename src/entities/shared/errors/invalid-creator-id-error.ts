import { BaseError } from '@shared/errors/base-error';
import { ErrorCode } from '@shared/errors/error-code.enum';

export class InvalidCreatorIdError extends BaseError {
  constructor(value: string) {
    super(ErrorCode.INVALID_PARAM_VALUE, `${value} is not a valid creator id.`);
  }
}

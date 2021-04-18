import { BaseError } from '@shared/errors/base-error';
import { ErrorCode } from '@shared/errors/error-code.enum';

export class ResourceNotFoundError extends BaseError {
  constructor(resourceName: string) {
    super(ErrorCode.RESOURCE_NOT_FOUND_ERROR, `${resourceName} not found.`);
  }
}

import { BaseError } from '@shared/errors/base-error';
import { ErrorType } from '@shared/errors/error-type.enum';

export class ResourceNotFoundError extends BaseError {
  constructor(resourceName: string) {
    super(ErrorType.RESOURCE_NOT_FOUND_ERROR, `${resourceName} not found.`);
  }
}

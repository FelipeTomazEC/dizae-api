import { Name } from '@entities/shared/name/name';
import { BaseError } from '@shared/errors/base-error';
import { ErrorType } from '@shared/errors/error-type.enum';

export class LocationAlreadyRegisteredError extends BaseError {
  constructor(name: Name) {
    super(
      ErrorType.DUPLICATED_RESOURCE,
      `Location ${name.value} already exists.`,
    );
  }
}

import { Name } from '@entities/shared/name/name';
import { BaseError } from '@shared/errors/base-error';
import { ErrorType } from '@shared/errors/error-type.enum';

export class ItemCategoryAlreadyExistsError extends BaseError {
  constructor(name: Name) {
    super(
      ErrorType.DUPLICATED_RESOURCE,
      `Category ${name.value} already exists.`,
    );
  }
}

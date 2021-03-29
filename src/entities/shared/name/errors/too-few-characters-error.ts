import { BaseError } from '@shared/errors/base-error';
import { ErrorCode } from '@shared/errors/error-code.enum';

export class TooFewCharactersError extends BaseError {
  constructor() {
    super(
      ErrorCode.TOO_FEW_CHARACTERS,
      `The name must have at least 2 characters.`,
    );
  }
}

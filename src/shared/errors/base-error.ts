import { ErrorType } from './error-type.enum';

export abstract class BaseError extends Error {
  protected constructor(
    readonly type: ErrorType,
    readonly message: string,
    readonly details?: string,
  ) {
    super();
  }
}

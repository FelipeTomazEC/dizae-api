import { ErrorCode } from './error-code.enum';

export abstract class BaseError extends Error {
  protected constructor(
    readonly type: ErrorCode,
    readonly message: string,
    readonly details?: string,
  ) {
    super();
  }
}

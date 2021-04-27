import { BaseError } from '@shared/errors/base-error';

export interface UseCaseOutputPort<T> {
  success(response: T): void;
  failure(error: BaseError): void;
}

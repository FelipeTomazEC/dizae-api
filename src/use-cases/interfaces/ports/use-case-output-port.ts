import { BaseError } from '@shared/errors/base-error';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';

export interface UseCaseOutputPort<T> {
  success(response: T): void;
  failure(error: BaseError | InvalidParamError): void;
}

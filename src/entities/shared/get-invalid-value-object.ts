import { Either, left, right } from '@shared/either.type';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { ValueObject } from '@entities/shared/value-object';
import { BaseError } from '@shared/errors/base-error';

interface ValueToValidate {
  name: string;
  valueObject: Either<BaseError, ValueObject<any>>;
}

export const getInvalidValueObject = (
  args: ValueToValidate[],
): Either<any, null> => {
  const paramWithError = args.find((item) => item.valueObject.isLeft());
  if (!paramWithError) {
    return right(null);
  }

  const error = paramWithError.valueObject.value as BaseError;

  return left(new InvalidParamError(paramWithError.name, error.message));
};

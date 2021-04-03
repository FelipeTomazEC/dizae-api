import { Either, left, right } from '@shared/either.type';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { ValueObject } from '@entities/shared/value-object';
import { ValueObjectError } from '@entities/shared/errors/value-object-error';

interface ValueToValidate {
  name: string;
  valueObject: Either<ValueObjectError, ValueObject<any>>;
}

export const getInvalidValueObject = (
  args: ValueToValidate[],
): Either<InvalidParamError, null> => {
  const paramWithError = args.find((item) => item.valueObject.isLeft());
  if (!paramWithError) {
    return right(null);
  }

  const error = paramWithError.valueObject.value as ValueObjectError;

  return left(new InvalidParamError(paramWithError.name, error));
};

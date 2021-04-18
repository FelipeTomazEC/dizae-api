import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { ValueObjectError } from '@entities/shared/errors/value-object-error';
import { ValueObject } from '@entities/shared/value-object';
import { Either, left, right } from '@shared/either.type';

interface ValueToValidate<T> {
  name: string;
  value: Either<ValueObjectError, T>;
}

type Values<Tuple extends [...any[]]> = {
  [Index in keyof Tuple]: ValueToValidate<Tuple[Index]>;
};

export const getValueObjects = <T extends [...ValueObject<any>[]]>(
  args: Values<T>,
): Either<InvalidParamError, T> => {
  const paramWithError = args.find((item) => item.value.isLeft());
  if (!paramWithError) {
    return right(args.map((a) => a.value.value) as T);
  }

  const error = paramWithError.value.value as ValueObjectError;

  return left(new InvalidParamError(paramWithError.name, error));
};

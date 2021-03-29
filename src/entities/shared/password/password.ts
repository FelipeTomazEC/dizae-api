import { ValueObject } from '@entities/shared/value-object';
import { Either, left, right } from '@shared/either.type';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { PasswordWithoutNumericCharError } from '@entities/shared/password/errors/password-without-numeric-char-error';
import { PasswordLengthError } from '@entities/shared/password/errors/password-length-error';

interface Props {
  value: string;
}

export class Password extends ValueObject<Props> {
  static readonly MINIMUM_LENGTH = 6;

  private constructor(props: Props) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create({
    value,
  }: Props): Either<
    MissingParamError | PasswordLengthError | PasswordWithoutNumericCharError,
    Password
  > {
    if (value === undefined || value === null) {
      return left(new MissingParamError('password'));
    }

    if (!value.match(/[0-9]/)) {
      return left(new PasswordWithoutNumericCharError());
    }

    if (value.length < Password.MINIMUM_LENGTH) {
      return left(new PasswordLengthError(Password.MINIMUM_LENGTH));
    }

    return right(new Password({ value }));
  }
}

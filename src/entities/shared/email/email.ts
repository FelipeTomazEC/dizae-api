import { ValueObject } from '@entities/shared/value-object';
import { Either, left, right } from '@shared/either.type';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { InvalidEmailError } from '@entities/shared/email/errors/invalid-email-error';

interface Props {
  value: string;
}

export class Email extends ValueObject<Props> {
  private constructor(props: Props) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create({
    value,
  }: Props): Either<MissingParamError | InvalidEmailError, Email> {
    if (value === null || value === undefined) {
      return left(new MissingParamError('email'));
    }

    if (!Email.validate(value)) {
      return left(new InvalidEmailError(value));
    }

    return right(new Email({ value }));
  }

  private static validate(value: string): boolean {
    const hasDoubleDot = value.match(/\.(\.)+/);
    const [localPart] = value.split('@');

    return (
      localPart.length < 64 &&
      !hasDoubleDot &&
      !!value.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i,
      )
    );
  }
}

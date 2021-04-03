import { ValueObject } from '@entities/shared/value-object';
import { Either, left, right } from '@shared/either.type';
import { TooFewCharactersError } from '@entities/shared/name/errors/too-few-characters-error';
import { isNullOrUndefined } from '@utils/is-null-or-undefined';
import { NullValueError } from '@entities/shared/errors/null-value-error';

interface Props {
  value: string;
}

export class Name extends ValueObject<Props> {
  private constructor(props: Props) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create({
    value,
  }: Props): Either<NullValueError | TooFewCharactersError, Name> {
    if (isNullOrUndefined(value)) {
      return left(new NullValueError());
    }

    if (value.length < 2) {
      return left(new TooFewCharactersError());
    }

    const capitalized = Name.capitalize(value);

    return right(new Name({ value: capitalized }));
  }

  private static capitalize(value: string): string {
    return value
      .split(' ')
      .map((word) => {
        const head = word.charAt(0).toUpperCase();
        const tail = word.substring(1).toLowerCase();
        return head.concat(tail);
      })
      .join(' ');
  }
}

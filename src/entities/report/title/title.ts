import { ValueObject } from '@entities/shared/value-object';
import { Either, left, right } from '@shared/either.type';
import { NullValueError } from '@entities/shared/errors/null-value-error';
import { TooShortTitleError } from '@entities/report/title/errors/too-short-title-error';
import { TooLongTitleError } from '@entities/report/title/errors/too-long-title-error';
import { isNullOrUndefined } from '@utils/is-null-or-undefined';
import { removeAdditionalSpaces } from '@utils/remove-addional-spaces';

interface Props {
  value: string;
}

export class Title extends ValueObject<Props> {
  static readonly MIN_LENGTH = 5;

  static readonly MAX_LENGTH = 25;

  private constructor(props: Props) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(
    props: Props,
  ): Either<NullValueError | TooShortTitleError | TooLongTitleError, Title> {
    if (isNullOrUndefined(props.value)) {
      return left(new NullValueError());
    }

    const valueWithoutAdditionalSpaces = removeAdditionalSpaces(props.value);

    if (valueWithoutAdditionalSpaces.length < Title.MIN_LENGTH) {
      return left(new TooShortTitleError(Title.MIN_LENGTH));
    }

    if (valueWithoutAdditionalSpaces.length > Title.MAX_LENGTH) {
      return left(new TooLongTitleError(Title.MAX_LENGTH));
    }

    return right(new Title({ value: valueWithoutAdditionalSpaces }));
  }
}

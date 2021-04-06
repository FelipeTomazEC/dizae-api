import { ValueObject } from '@entities/shared/value-object';
import { Either, left, right } from '@shared/either.type';
import { TooLongDescriptionError } from '@entities/report/description/errors/too-long-description-error';
import { removeAdditionalSpaces } from '@utils/remove-addional-spaces';

interface Props {
  value: string;
}

export class Description extends ValueObject<Props> {
  static readonly MAX_LENGTH = 120;

  private constructor(props: Props) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(
    props: Props = { value: '' },
  ): Either<TooLongDescriptionError, Description> {
    const valueWithoutAdditionalSpaces = removeAdditionalSpaces(
      props.value ?? '',
    );

    if (valueWithoutAdditionalSpaces.length > Description.MAX_LENGTH) {
      return left(new TooLongDescriptionError(Description.MAX_LENGTH));
    }

    return right(new Description({ value: valueWithoutAdditionalSpaces }));
  }
}

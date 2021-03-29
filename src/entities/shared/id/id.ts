import { ValueObject } from '@entities/shared/value-object';
import { Either, left, right } from '@shared/either.type';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { ValueIsNotUUIDError } from '@entities/shared/id/errors/value-is-not-uuid-error';

interface Props {
  value: string;
}

export class Id extends ValueObject<Props> {
  private constructor(props: Props) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create({
    value,
  }: Props): Either<MissingParamError | ValueIsNotUUIDError, Id> {
    if (value === null || value === undefined) {
      return left(new MissingParamError('id'));
    }

    if (!this.isUUID(value)) {
      return left(new ValueIsNotUUIDError(value));
    }

    return right(new Id({ value }));
  }

  private static isUUID(value: string): boolean {
    return !!value.match(
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
    );
  }
}

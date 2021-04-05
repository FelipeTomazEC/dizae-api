import { ValueObject } from '@entities/shared/value-object';
import { Either, left, right } from '@shared/either.type';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { getInvalidValueObject } from '@entities/shared/get-invalid-value-object';

interface ReportItemProps {
  locationId: Id;
  name: Name;
}

interface Props {
  locationId: string;
  name: string;
}

export class ReportItem extends ValueObject<ReportItemProps> {
  private constructor(props: ReportItemProps) {
    super(props);
  }

  get name(): Name {
    return this.props.name;
  }

  get locationId(): Id {
    return this.props.locationId;
  }

  static create(props: Props): Either<InvalidParamError, ReportItem> {
    const nameOrError = Name.create({ value: props.name });
    const locationIdOrError = Id.create({ value: props.locationId });
    const validation = getInvalidValueObject([
      { name: 'name', valueObject: nameOrError },
      { name: 'locationId', valueObject: locationIdOrError },
    ]);

    if (validation.isLeft()) {
      return left(validation.value);
    }

    const name = nameOrError.value as Name;
    const locationId = locationIdOrError.value as Id;

    return right(new ReportItem({ name, locationId }));
  }
}

import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { ValueObject } from '@entities/shared/value-object';
import { Either, left, right } from '@shared/either.type';
import { getValueObjects } from '@utils/get-value-objects';

interface ReportItemProps {
  locationId: Id;
  name: Name;
}

interface Data {
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

  static create(data: Data): Either<InvalidParamError, ReportItem> {
    const nameOrError = Name.create({ value: data.name });
    const locationIdOrError = Id.create({ value: data.locationId });
    const validation = getValueObjects<[Name, Id]>([
      { name: 'name', value: nameOrError },
      { name: 'locationId', value: locationIdOrError },
    ]);

    if (validation.isLeft()) {
      return left(validation.value);
    }

    const [name, locationId] = validation.value;

    return right(new ReportItem({ name, locationId }));
  }
}

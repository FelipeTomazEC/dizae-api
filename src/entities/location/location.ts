import { Id } from '@entities/shared/id/id';
import { Timestamp } from '@entities/shared/renamed-primitive-types';
import { Name } from '@entities/shared/name/name';
import { LocationData } from '@entities/location/location-data';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { BaseError } from '@shared/errors/base-error';

import { Either, left, right } from '@shared/either.type';
import { InvalidCreatorIdError } from '@entities/location/errors/invalid-creator-id-error';

interface Props {
  id: Id;
  creatorId: Id;
  createdAt: Timestamp;
  name: Name;
}

export class Location {
  private constructor(private readonly props: Props) {
    Object.freeze(this);
  }

  get id(): Id {
    return this.props.id;
  }

  get creatorId(): Id {
    return this.props.creatorId;
  }

  get createdAt(): Timestamp {
    return this.props.createdAt;
  }

  get name(): Name {
    return this.props.name;
  }

  static create(
    data: LocationData,
  ): Either<MissingParamError | BaseError | InvalidCreatorIdError, Location> {
    const idOrError = Id.create({ value: data.id });
    const creatorIdOrError = Id.create({ value: data.creatorId });
    const nameOrError = Name.create({ value: data.name });
    const { createdAt } = data;

    if (idOrError.isLeft()) {
      return left(idOrError.value);
    }

    if (data.creatorId === null || data.creatorId === undefined) {
      return left(new MissingParamError('creatorId'));
    }

    if (creatorIdOrError.isLeft()) {
      return left(new InvalidCreatorIdError(data.creatorId));
    }

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    if (createdAt === undefined || createdAt === null) {
      return left(new MissingParamError('createdAt'));
    }

    const name: Name = nameOrError.value;
    const id: Id = idOrError.value;
    const creatorId: Id = creatorIdOrError.value;

    return right(new Location({ name, createdAt, creatorId, id }));
  }
}

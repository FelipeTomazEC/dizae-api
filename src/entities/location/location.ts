import { LocationData } from '@entities/location/location-data';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { getInvalidValueObject } from '@entities/shared/get-invalid-value-object';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { Timestamp } from '@entities/shared/renamed-primitive-types';
import { Either, left, right } from '@shared/either.type';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { isNullOrUndefined } from '@utils/is-null-or-undefined';
import { Item } from './item/item';

interface Props {
  id: Id;
  creatorId: Id;
  createdAt: Timestamp;
  name: Name;
}

export class Location {
  private readonly items: Item[];

  private constructor(private readonly props: Props) {
    this.items = [];
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

  public getItems(): Item[] {
    return [...this.items];
  }

  public addItem(item: Item): void {
    if (!this.isItemRegistered(item)) {
      this.items.push(item);
    }
  }

  public isItemRegistered(item: Item): boolean {
    return this.items.some((i) => i.name.isEqual(item.name));
  }

  static create(
    data: LocationData,
  ): Either<MissingParamError | InvalidParamError, Location> {
    const idOrError = Id.create({ value: data.id });
    const creatorIdOrError = Id.create({ value: data.creatorId });
    const nameOrError = Name.create({ value: data.name });
    const { createdAt } = data;

    const validation = getInvalidValueObject([
      { name: 'id', valueObject: idOrError },
      { name: 'creatorId', valueObject: creatorIdOrError },
      { name: 'name', valueObject: nameOrError },
    ]);

    if (validation.isLeft()) {
      return left(validation.value);
    }

    if (isNullOrUndefined(createdAt)) {
      return left(new MissingParamError('createdAt'));
    }

    const name = nameOrError.value as Name;
    const id = idOrError.value as Id;
    const creatorId = creatorIdOrError.value as Id;

    return right(new Location({ name, createdAt, creatorId, id }));
  }
}

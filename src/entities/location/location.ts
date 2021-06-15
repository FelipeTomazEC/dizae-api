import { LocationData } from '@entities/location/location-data';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { Either, left, right } from '@shared/either.type';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { getValueObjects } from '@utils/get-value-objects';
import { isNullOrUndefined } from '@utils/is-null-or-undefined';
import { Item } from './item/item';

interface Props {
  id: Id;
  creatorId: Id;
  createdAt: Date;
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

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get name(): Name {
    return this.props.name;
  }

  public getItems(): Item[] {
    return [...this.items];
  }

  public addItem(item: Item): void {
    if (!this.isItemRegistered(item.name)) {
      this.items.push(item);
    }
  }

  public isItemRegistered(itemName: Name): boolean {
    return this.items.some((i) => i.name.isEqual(itemName));
  }

  public getItem(name: Name): Item | undefined {
    return this.items.find((i) => i.name.isEqual(name));
  }

  static create(
    data: LocationData,
  ): Either<MissingParamError | InvalidParamError, Location> {
    const idOrError = Id.create({ value: data.id });
    const creatorIdOrError = Id.create({ value: data.creatorId });
    const nameOrError = Name.create({ value: data.name });
    const { createdAt } = data;

    if (isNullOrUndefined(createdAt)) {
      return left(new MissingParamError('createdAt'));
    }

    const validation = getValueObjects<[Id, Id, Name]>([
      { name: 'id', value: idOrError },
      { name: 'creatorId', value: creatorIdOrError },
      { name: 'name', value: nameOrError },
    ]);

    if (validation.isLeft()) {
      return left(validation.value);
    }

    const [id, creatorId, name] = validation.value;

    return right(new Location({ name, createdAt, creatorId, id }));
  }
}

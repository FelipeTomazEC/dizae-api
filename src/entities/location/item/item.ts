import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { Timestamp, URL } from '@entities/shared/renamed-primitive-types';
import { Either, left, right } from '@shared/either.type';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { getValueObjects } from '@utils/get-value-objects';
import { ItemData } from './item-data';

interface Props {
  name: Name;
  creatorId: Id;
  createdAt: Timestamp;
  categoryId: Id;
  image: URL;
}

export class Item {
  private constructor(private readonly props: Props) {}

  get name(): Name {
    return this.props.name;
  }

  get creatorId(): Id {
    return this.props.creatorId;
  }

  get createdAt(): Timestamp {
    return this.props.createdAt;
  }

  get categoryId(): Id {
    return this.props.categoryId;
  }

  get image(): URL {
    return this.props.image;
  }

  static create(
    data: ItemData,
  ): Either<InvalidParamError | MissingParamError, Item> {
    const nameOrError = Name.create({ value: data.name });
    const creatorIdOrError = Id.create({ value: data.creatorId });
    const categoryIdOrError = Id.create({ value: data.categoryId });
    const { image, createdAt } = data;

    if (image === null || image === undefined) {
      return left(new MissingParamError('image'));
    }

    if (createdAt === null || createdAt === undefined) {
      return left(new MissingParamError('createdAt'));
    }

    const validation = getValueObjects<[Name, Id, Id]>([
      { name: 'name', value: nameOrError },
      { name: 'creatorId', value: creatorIdOrError },
      { name: 'categoryId', value: categoryIdOrError },
    ]);

    if (validation.isLeft()) {
      return left(validation.value);
    }

    const [name, creatorId, categoryId] = validation.value;

    return right(new Item({ creatorId, image, categoryId, createdAt, name }));
  }
}

import { Either, left, right } from '../../../shared/either.type';
import { MissingParamError } from '../../../shared/errors/missing-param-error';
import { InvalidParamError } from '../../shared/errors/invalid-param-error';
import { getInvalidValueObject } from '../../shared/get-invalid-value-object';
import { Id } from '../../shared/id/id';
import { Name } from '../../shared/name/name';
import { Timestamp, URL } from '../../shared/renamed-primitive-types';
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

    const validation = getInvalidValueObject([
      { name: 'name', valueObject: nameOrError },
      { name: 'creatorId', valueObject: creatorIdOrError },
      { name: 'categoryId', valueObject: categoryIdOrError },
    ]);

    if (validation.isLeft()) {
      return left(validation.value);
    }

    if (image === null || image === undefined) {
      return left(new MissingParamError('image'));
    }

    if (createdAt === null || createdAt === undefined) {
      return left(new MissingParamError('createdAt'));
    }

    const name = nameOrError.value as Name;
    const creatorId = creatorIdOrError.value as Id;
    const categoryId = categoryIdOrError.value as Id;

    return right(new Item({ creatorId, image, categoryId, createdAt, name }));
  }
}

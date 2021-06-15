import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { URL } from '@entities/shared/renamed-primitive-types';
import { Either, left, right } from '@shared/either.type';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { getValueObjects } from '@utils/get-value-objects';
import { isNullOrUndefined } from '@utils/is-null-or-undefined';
import { ItemData } from './item-data';

interface Props {
  name: Name;
  creatorId: Id;
  createdAt: Date;
  categoryName: Name;
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

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get categoryName(): Name {
    return this.props.categoryName;
  }

  get image(): URL {
    return this.props.image;
  }

  static create(
    data: ItemData,
  ): Either<InvalidParamError | MissingParamError, Item> {
    const nameOrError = Name.create({ value: data.name });
    const creatorIdOrError = Id.create({ value: data.creatorId });
    const categoryNameOrError = Name.create({ value: data.categoryName });
    const { image, createdAt } = data;

    if (isNullOrUndefined(image)) {
      return left(new MissingParamError('image'));
    }

    if (isNullOrUndefined(createdAt)) {
      return left(new MissingParamError('createdAt'));
    }

    const validation = getValueObjects<[Name, Id, Name]>([
      { name: 'name', value: nameOrError },
      { name: 'creatorId', value: creatorIdOrError },
      { name: 'categoryName', value: categoryNameOrError },
    ]);

    if (validation.isLeft()) {
      return left(validation.value);
    }

    const [name, creatorId, categoryName] = validation.value;

    return right(new Item({ creatorId, image, categoryName, createdAt, name }));
  }
}

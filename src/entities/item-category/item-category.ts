import { ItemCategoryData } from '@entities/item-category/item-category-data';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { Timestamp } from '@entities/shared/renamed-primitive-types';
import { Either, left, right } from '@shared/either.type';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { getValueObjects } from '@utils/get-value-objects';
import { isNullOrUndefined } from '@utils/is-null-or-undefined';

interface Props {
  name: Name;
  creatorId: Id;
  createdAt: Timestamp;
}

export class ItemCategory {
  private constructor(private readonly props: Props) {
    Object.freeze(this);
  }

  get name(): Name {
    return this.props.name;
  }

  get creatorId(): Id {
    return this.props.creatorId;
  }

  get createdAt(): Timestamp {
    return this.props.createdAt;
  }

  static create(
    data: ItemCategoryData,
  ): Either<MissingParamError | InvalidParamError, ItemCategory> {
    const nameOrError = Name.create({ value: data.name });
    const creatorIdOrError = Id.create({ value: data.creatorId });

    const validation = getValueObjects<[Name, Id]>([
      { name: 'name', value: nameOrError },
      { name: 'creatorId', value: creatorIdOrError },
    ]);

    if (validation.isLeft()) {
      return left(validation.value);
    }

    if (isNullOrUndefined(data.createdAt)) {
      return left(new MissingParamError('createdAt'));
    }

    const [name, creatorId] = validation.value;
    const { createdAt } = data;

    return right(new ItemCategory({ creatorId, createdAt, name }));
  }
}

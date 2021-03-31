import { Timestamp } from '@entities/shared/renamed-primitive-types';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { ItemCategoryData } from '@entities/item-category/item-category-data';
import { Either, left, right } from '@shared/either.type';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { InvalidCreatorIdError } from '@entities/shared/errors/invalid-creator-id-error';
import { BaseError } from '@shared/errors/base-error';

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
  ): Either<
    MissingParamError | InvalidCreatorIdError | BaseError,
    ItemCategory
  > {
    const nameOrError = Name.create({ value: data.name });
    const creatorIdOrError = Id.create({ value: data.creatorId });
    const { createdAt } = data;

    if (createdAt === undefined || createdAt === null) {
      return left(new MissingParamError('createdAt'));
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

    const creatorId: Id = creatorIdOrError.value;
    const name: Name = nameOrError.value;

    return right(new ItemCategory({ creatorId, createdAt, name }));
  }
}

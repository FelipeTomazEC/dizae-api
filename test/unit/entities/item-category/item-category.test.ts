import { ItemCategory } from '@entities/item-category/item-category';
import { ItemCategoryData } from '@entities/item-category/item-category-data';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { NullValueError } from '@entities/shared/errors/null-value-error';
import { ValueIsNotUUIDError } from '@entities/shared/id/errors/value-is-not-uuid-error';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { getObjectWithNullProperty } from '@test/test-helpers/get-object-with-null-property';
import * as faker from 'faker';

describe('Category entity tests.', () => {
  const example: ItemCategoryData = {
    name: faker.commerce.product(),
    creatorId: faker.datatype.uuid(),
    createdAt: Date.now(),
  };

  const getItemCategoryDataWithNullParams = getObjectWithNullProperty(example);

  it('should have a valid name.', () => {
    const data = getItemCategoryDataWithNullParams('name');
    const categoryOrError = ItemCategory.create(data);

    expect(categoryOrError.isLeft()).toBeTruthy();
    expect(categoryOrError.value).toStrictEqual(
      new InvalidParamError('name', new NullValueError()),
    );
  });

  it('should have a creation date.', () => {
    const data = getItemCategoryDataWithNullParams('createdAt');
    const categoryOrError = ItemCategory.create(data);

    expect(categoryOrError.isLeft()).toBeTruthy();
    expect(categoryOrError.value).toStrictEqual(
      new MissingParamError('createdAt'),
    );
  });

  it('should have a creator id defined.', () => {
    const data = getItemCategoryDataWithNullParams('creatorId');
    const categoryOrError = ItemCategory.create(data);

    expect(categoryOrError.isLeft()).toBeTruthy();
    expect(categoryOrError.value).toStrictEqual(
      new InvalidParamError('creatorId', new NullValueError()),
    );
  });

  it('should have a valid creator id.', () => {
    const data = { ...example, creatorId: 'invalid-id' };
    const categoryOrError = ItemCategory.create(data);

    expect(categoryOrError.isLeft()).toBeTruthy();
    expect(categoryOrError.value).toStrictEqual(
      new InvalidParamError('creatorId', new ValueIsNotUUIDError('invalid-id')),
    );
  });

  it('should create an item category instance.', () => {
    const categoryOrError = ItemCategory.create(example);
    const category = categoryOrError.value as ItemCategory;

    expect(categoryOrError.isRight()).toBeTruthy();
    expect(category).toBeInstanceOf(ItemCategory);
    expect(category.name.value).toBe(example.name);
    expect(category.creatorId.value).toBe(example.creatorId);
    expect(category.createdAt).toBe(example.createdAt);
  });
});

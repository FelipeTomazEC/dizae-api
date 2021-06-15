import { Item } from '@entities/location/item/item';
import { ItemData } from '@entities/location/item/item-data';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { NullValueError } from '@entities/shared/errors/null-value-error';
import { ValueIsNotUUIDError } from '@entities/shared/id/errors/value-is-not-uuid-error';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { getObjectWithNullProperty } from '@test/test-helpers/get-object-with-null-property';
import * as faker from 'faker';

describe('Item entity tests.', () => {
  const example: ItemData = {
    name: faker.commerce.product(),
    creatorId: faker.datatype.uuid(),
    image: faker.image.image(),
    categoryName: faker.commerce.productMaterial(),
    createdAt: new Date(),
  };

  const getItemWithNullProps = getObjectWithNullProperty(example);

  it('should have a valid name.', () => {
    const data = getItemWithNullProps('name');
    const itemOrError = Item.create(data);
    const error = new InvalidParamError('name', new NullValueError());

    expect(itemOrError.isLeft()).toBeTruthy();
    expect(itemOrError.value).toStrictEqual(error);
  });

  it('should have a valid creator id.', () => {
    const data = { ...example, creatorId: 'invalid-id' };
    const itemOrError = Item.create(data);
    const error = new InvalidParamError(
      'creatorId',
      new ValueIsNotUUIDError('invalid-id'),
    );

    expect(itemOrError.isLeft()).toBeTruthy();
    expect(itemOrError.value).toStrictEqual(error);
  });

  it('should have a category.', () => {
    const data = getItemWithNullProps('categoryName');
    const itemOrError = Item.create(data);
    const error = new InvalidParamError('categoryName', new NullValueError());

    expect(itemOrError.isLeft()).toBeTruthy();
    expect(itemOrError.value).toStrictEqual(error);
  });

  it('should have a creation date.', () => {
    const data = getItemWithNullProps('createdAt');
    const itemOrError = Item.create(data);

    expect(itemOrError.isLeft()).toBeTruthy();
    expect(itemOrError.value).toStrictEqual(new MissingParamError('createdAt'));
  });

  it('should have an image.', () => {
    const data = getItemWithNullProps('image');
    const itemOrError = Item.create(data);

    expect(itemOrError.isLeft()).toBeTruthy();
    expect(itemOrError.value).toStrictEqual(new MissingParamError('image'));
  });

  it('should create an item entity instance.', () => {
    const itemOrError = Item.create(example);
    const item = itemOrError.value as Item;

    expect(itemOrError.isRight()).toBeTruthy();
    expect(item).toBeDefined();
    expect(item.categoryName.value).toBe(example.categoryName);
    expect(item.createdAt).toBe(example.createdAt);
    expect(item.image).toBe(example.image);
    expect(item.creatorId.value).toBe(example.creatorId);
    expect(item.name.value).toBe(example.name);
  });
});

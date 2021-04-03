import * as faker from 'faker';
import { getObjectWithNullProperty } from '@test/test-helpers/get-object-with-null-property';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { ItemData } from '@entities/item/item-data';
import { Item } from '@entities/item/item';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { ValueIsNotUUIDError } from '@entities/shared/id/errors/value-is-not-uuid-error';

describe('Item entity tests.', () => {
  const example: ItemData = {
    name: faker.commerce.product(),
    creatorId: faker.random.uuid(),
    image: faker.image.image(),
    categoryId: faker.random.uuid(),
    createdAt: Date.now(),
    id: faker.random.uuid(),
  };

  const getItemWithNullProps = getObjectWithNullProperty(example);

  it('should have a valid name.', () => {
    const data = getItemWithNullProps('name');
    const itemOrError = Item.create(data);
    const error = new InvalidParamError(
      'name',
      new MissingParamError('name').message,
    );

    expect(itemOrError.isLeft()).toBeTruthy();
    expect(itemOrError.value).toStrictEqual(error);
  });

  it('should have a valid creator id.', () => {
    const data = { ...example, creatorId: 'invalid-id' };
    const itemOrError = Item.create(data);
    const error = new InvalidParamError(
      'creatorId',
      new ValueIsNotUUIDError('invalid-id').message,
    );

    expect(itemOrError.isLeft()).toBeTruthy();
    expect(itemOrError.value).toStrictEqual(error);
  });

  it('should have a valid id.', () => {
    const data = getItemWithNullProps('id');
    const itemOrError = Item.create(data);
    const error = new InvalidParamError(
      'id',
      new MissingParamError('id').message,
    );

    expect(itemOrError.isLeft()).toBeTruthy();
    expect(itemOrError.value).toStrictEqual(error);
  });

  it('should have a category.', () => {
    const data = getItemWithNullProps('categoryId');
    const itemOrError = Item.create({ ...data, categoryId: 'invalid' });
    const error = new InvalidParamError(
      'categoryId',
      new ValueIsNotUUIDError('invalid').message,
    );

    expect(itemOrError.isLeft()).toBeTruthy();
    expect(itemOrError.value).toStrictEqual(error);
  });

  it('should have a creation date.', () => {
    const data = getItemWithNullProps('createdAt');
    const itemOrError = Item.create(data);
    const error = new MissingParamError('createdAt');

    expect(itemOrError.isLeft()).toBeTruthy();
    expect(itemOrError.value).toStrictEqual(error);
  });

  it('should have an image.', () => {
    const data = getItemWithNullProps('image');
    const itemOrError = Item.create(data);
    const error = new MissingParamError('image');

    expect(itemOrError.isLeft()).toBeTruthy();
    expect(itemOrError.value).toStrictEqual(error);
  });

  it('should create an item entity instance.', () => {
    const itemOrError = Item.create(example);
    const item = itemOrError.value as Item;

    expect(itemOrError.isRight()).toBeTruthy();
    expect(item).toBeDefined();
    expect(item.categoryId.value).toBe(example.categoryId);
    expect(item.createdAt).toBe(example.createdAt);
    expect(item.id.value).toBe(example.id);
    expect(item.image).toBe(example.image);
    expect(item.creatorId.value).toBe(example.creatorId);
    expect(item.name.value).toBe(example.name);
  });
});

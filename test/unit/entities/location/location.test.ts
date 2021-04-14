import { Item } from '@entities/location/item/item';
import { Location } from '@entities/location/location';
import { LocationData } from '@entities/location/location-data';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { NullValueError } from '@entities/shared/errors/null-value-error';
import { ValueIsNotUUIDError } from '@entities/shared/id/errors/value-is-not-uuid-error';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { getObjectWithNullProperty } from '@test/test-helpers/get-object-with-null-property';
import * as faker from 'faker';

describe('Location entity tests.', () => {
  const example: LocationData = {
    name: 'SOME location HeRe',
    createdAt: Date.now(),
    id: faker.random.uuid(),
    creatorId: faker.random.uuid(),
  };

  const createItem = (): Item =>
    Item.create({
      categoryId: faker.random.uuid(),
      createdAt: Date.now(),
      creatorId: faker.random.uuid(),
      image: faker.image.image(),
      name: faker.commerce.product(),
    }).value as Item;

  const getLocationDataWithNullProps = getObjectWithNullProperty(example);

  it('should have a valid name.', () => {
    const data = getLocationDataWithNullProps('name');
    const locationOrError = Location.create(data);

    expect(locationOrError.isLeft()).toBeTruthy();
    expect(locationOrError.value).toStrictEqual(
      new InvalidParamError('name', new NullValueError()),
    );
  });

  it('should have a creation date', () => {
    const data = getLocationDataWithNullProps('createdAt');
    const locationOrError = Location.create(data);

    expect(locationOrError.isLeft()).toBeTruthy();
    expect(locationOrError.value).toStrictEqual(
      new MissingParamError('createdAt'),
    );
  });

  it('should have a valid id.', () => {
    const data = { ...example, id: 'not-valid-id' };
    const locationOrError = Location.create(data);

    expect(locationOrError.isLeft()).toBeTruthy();
    expect(locationOrError.value).toStrictEqual(
      new InvalidParamError('id', new ValueIsNotUUIDError(data.id)),
    );
  });

  it('should have its creator id reference.', () => {
    const data = getLocationDataWithNullProps('creatorId');
    const locationOrError = Location.create(data);

    expect(locationOrError.isLeft()).toBeTruthy();
    expect(locationOrError.value).toStrictEqual(
      new InvalidParamError('creatorId', new NullValueError()),
    );
  });

  it('should have a valid creator uuid.', () => {
    const data = { ...example, creatorId: 'invalid-id' };
    const locationOrError = Location.create(data);

    expect(locationOrError.isLeft()).toBeTruthy();
    expect(locationOrError.value).toStrictEqual(
      new InvalidParamError(
        'creatorId',
        new ValueIsNotUUIDError(data.creatorId),
      ),
    );
  });

  it('should create a location instance.', () => {
    const locationOrError = Location.create(example);
    const location: Location = locationOrError.value as Location;

    expect(locationOrError.isRight()).toBeTruthy();
    expect(location).toBeInstanceOf(Location);
    expect(location.id.value).toBe(example.id);
    expect(location.name.value).toBe('Some Location Here');
    expect(location.creatorId.value).toBe(example.creatorId);
    expect(location.createdAt).toBe(example.createdAt);
  });

  it('should not add duplicate items.', () => {
    const location = Location.create(example).value as Location;
    const item = createItem();

    location.addItem(item);
    location.addItem(item);
    const itemOccurrences = location
      .getItems()
      .filter((i) => i.name.isEqual(item.name));

    expect(itemOccurrences.length).toBe(1);
  });

  it('should inform if an item is present.', () => {
    const location = Location.create(example).value as Location;
    const item1 = createItem();
    const item2 = createItem();

    location.addItem(item1);

    expect(location.isItemRegistered(item1)).toBeTruthy();
    expect(location.isItemRegistered(item2)).toBeFalsy();
  });
});

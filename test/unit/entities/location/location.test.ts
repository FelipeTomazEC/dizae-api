import * as faker from 'faker';
import { getObjectWithNullProperty } from '@test/test-helpers/get-object-with-null-property';
import { ValueIsNotUUIDError } from '@entities/shared/id/errors/value-is-not-uuid-error';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { LocationData } from '@entities/location/location-data';
import { Location } from '@entities/location/location';
import { InvalidCreatorIdError } from '@entities/location/errors/invalid-creator-id-error';

describe('Location entity tests.', () => {
  const example: LocationData = {
    name: 'SOME location HeRe',
    createdAt: Date.now(),
    id: faker.random.uuid(),
    creatorId: faker.random.uuid(),
  };

  const getLocationDataWithNullProps = getObjectWithNullProperty(example);

  it('should have a valid name.', () => {
    const data = getLocationDataWithNullProps('name');
    const locationOrError = Location.create(data);

    expect(locationOrError.isLeft()).toBeTruthy();
  });

  it('should have a creation date', () => {
    const data = getLocationDataWithNullProps('createdAt');
    const locationOrError = Location.create(data);

    expect(locationOrError.isLeft()).toBeTruthy();
  });

  it('should have a valid id.', () => {
    const data = { ...example, id: 'not-valid-id' };
    const locationOrError = Location.create(data);

    expect(locationOrError.isLeft()).toBeTruthy();
    expect(locationOrError.value).toStrictEqual(
      new ValueIsNotUUIDError(data.id),
    );
  });

  it('should have its creator id reference.', () => {
    const data = getLocationDataWithNullProps('creatorId');
    const locationOrError = Location.create(data);

    expect(locationOrError.isLeft()).toBeTruthy();
    expect(locationOrError.value).toStrictEqual(
      new MissingParamError('creatorId'),
    );
  });

  it('should have a valid creator uuid.', () => {
    const data = { ...example, creatorId: 'invalid-id' };
    const locationOrError = Location.create(data);

    expect(locationOrError.isLeft()).toBeTruthy();
    expect(locationOrError.value).toStrictEqual(
      new InvalidCreatorIdError('invalid-id'),
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
});

import { NullValueError } from '@entities/shared/errors/null-value-error';
import { ValueIsNotUUIDError } from '@entities/shared/id/errors/value-is-not-uuid-error';
import { Id } from '@entities/shared/id/id';
import * as faker from 'faker';

describe('Id value object tests.', () => {
  it('should be defined.', () => {
    const value: any = undefined;
    const idOrError = Id.create({ value });

    expect(idOrError.isLeft()).toBeTruthy();
    expect(idOrError.value).toStrictEqual(new NullValueError());
  });

  it('should be a uuid valid format.', () => {
    const value = 'not-valid-uuid';
    const idOrError = Id.create({ value });

    expect(idOrError.isLeft()).toBeTruthy();
    expect(idOrError.value).toStrictEqual(new ValueIsNotUUIDError(value));
  });

  it('should create an id object.', () => {
    const value = faker.datatype.uuid();
    const idOrError = Id.create({ value });
    const id = idOrError.value as Id;

    expect(idOrError.isRight()).toBeTruthy();
    expect(id).toBeInstanceOf(Id);
    expect(id.value).toBe(value);
  });
});

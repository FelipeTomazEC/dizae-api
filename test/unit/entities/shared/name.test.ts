import { Name } from '@entities/shared/name/name';
import { TooFewCharactersError } from '@entities/shared/name/errors/too-few-characters-error';
import { NullValueError } from '@entities/shared/errors/null-value-error';

describe('Name object tests.', () => {
  it('should have at least 2 characters.', () => {
    const nameOrError = Name.create({ value: 'a' });

    expect(nameOrError.isLeft()).toBeTruthy();
    expect(nameOrError.value).toStrictEqual(new TooFewCharactersError());
  });

  it('should be not null/undefined.', () => {
    const value: any = undefined;
    const nameOrError = Name.create({ value });

    expect(nameOrError.isLeft()).toBeTruthy();
    expect(nameOrError.value).toStrictEqual(new NullValueError());
  });

  it('should be formatted.', () => {
    const value = 'sOme unFormATTED naME';
    const nameOrError = Name.create({ value });
    const name = nameOrError.value as Name;

    expect(nameOrError.isRight()).toBeTruthy();
    expect(name).toBeInstanceOf(Name);
    expect(name.value).toBe('Some Unformatted Name');
  });
});

import { Name } from '@entities/shared/name/name';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { TooFewCharactersError } from '@entities/shared/name/errors/too-few-characters-error';

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
    expect(nameOrError.value).toStrictEqual(new MissingParamError('name'));
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

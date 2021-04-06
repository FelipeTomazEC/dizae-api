import { getNullAsType } from '@test/test-helpers/get-null-as-type';
import { NullValueError } from '@entities/shared/errors/null-value-error';
import { Title } from '@entities/report/title/title';
import { TooShortTitleError } from '@entities/report/title/errors/too-short-title-error';
import { TooLongTitleError } from '@entities/report/title/errors/too-long-title-error';

describe('Title value object tests.', () => {
  it('should be not null/undefined.', () => {
    const value = getNullAsType<string>();
    const titleOrError = Title.create({ value });

    expect(titleOrError.isLeft()).toBeTruthy();
    expect(titleOrError.value).toStrictEqual(new NullValueError());
  });

  it(`should have at least ${Title.MIN_LENGTH} characters.`, () => {
    const titleOrError = Title.create({ value: '   notV' });

    expect(titleOrError.isLeft()).toBeTruthy();
    expect(titleOrError.value).toStrictEqual(
      new TooShortTitleError(Title.MIN_LENGTH),
    );
  });

  it(`should not have more than ${Title.MAX_LENGTH} characters.`, () => {
    const value = 'a'.repeat(Title.MAX_LENGTH + 1);
    const titleOrError = Title.create({ value });

    expect(titleOrError.isLeft()).toBeTruthy();
    expect(titleOrError.value).toStrictEqual(
      new TooLongTitleError(Title.MAX_LENGTH),
    );
  });

  it('should create a title value object instance.', () => {
    const value = 'This is a valid title.';
    const titleOrError = Title.create({ value });
    const title = titleOrError.value as Title;

    expect(titleOrError.isRight()).toBeTruthy();
    expect(title).toBeDefined();
    expect(title.value).toBe(value);
  });

  it('should remove additional spaces.', () => {
    const value = '    This    is  a      valid    title.   ';
    const titleOrError = Title.create({ value });
    const title = titleOrError.value as Title;

    expect(titleOrError.isRight()).toBeTruthy();
    expect(title).toBeDefined();
    expect(title.value).toBe('This is a valid title.');
  });
});

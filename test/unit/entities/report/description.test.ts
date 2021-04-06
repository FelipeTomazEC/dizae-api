import { Description } from '@entities/report/description/description';
import { TooLongDescriptionError } from '@entities/report/description/errors/too-long-description-error';

describe('Description value object tests.', () => {
  it(`should not have more than ${Description.MAX_LENGTH} characters.`, () => {
    const value = 'a'.repeat(Description.MAX_LENGTH + 1);
    const descriptionOrError = Description.create({ value });

    expect(descriptionOrError.isLeft()).toBeTruthy();
    expect(descriptionOrError.value).toStrictEqual(
      new TooLongDescriptionError(Description.MAX_LENGTH),
    );
  });

  it(`should initialize with an empty string.`, () => {
    const descriptionOrError = Description.create();
    const description = descriptionOrError.value as Description;

    expect(descriptionOrError.isRight()).toBeTruthy();
    expect(description).toBeDefined();
    expect(description.value).toBe('');
  });

  it(`should create description instance.`, () => {
    const value =
      'This is a valid description. Not too long neither to short. Just it.';
    const descriptionOrError = Description.create({ value });
    const description = descriptionOrError.value as Description;

    expect(descriptionOrError.isRight()).toBeTruthy();
    expect(description).toBeDefined();
    expect(description.value).toBe(value);
  });

  it(`should remove additional spaces.`, () => {
    const value =
      'This is a valid       description with additional   spaces.      Not too        long neither to short.   Just it.';
    const descriptionOrError = Description.create({ value });
    const description = descriptionOrError.value as Description;

    expect(descriptionOrError.isRight()).toBeTruthy();
    expect(description).toBeDefined();
    expect(description.value).toBe(
      'This is a valid description with additional spaces. Not too long neither to short. Just it.',
    );
  });
});

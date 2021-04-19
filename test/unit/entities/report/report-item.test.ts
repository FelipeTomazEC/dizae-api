import { ReportItem } from '@entities/report/report-item/report-item';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { NullValueError } from '@entities/shared/errors/null-value-error';
import { getNullAsType } from '@test/test-helpers/get-null-as-type';
import * as faker from 'faker';

describe('Report Item value object tests', () => {
  it('should have a valid item id.', () => {
    const name = getNullAsType<string>();
    const locationId = faker.datatype.uuid();
    const itemOrError = ReportItem.create({ name, locationId });

    expect(itemOrError.isLeft()).toBeTruthy();
    expect(itemOrError.value).toStrictEqual(
      new InvalidParamError('name', new NullValueError()),
    );
  });

  it('should have a valid item name.', () => {
    const name = faker.commerce.product();
    const locationId = getNullAsType<string>();
    const itemOrError = ReportItem.create({ name, locationId });

    expect(itemOrError.isLeft()).toBeTruthy();
    expect(itemOrError.value).toStrictEqual(
      new InvalidParamError('locationId', new NullValueError()),
    );
  });

  it('should create a report item instance.', () => {
    const name = faker.commerce.product();
    const locationId = faker.datatype.uuid();
    const itemOrError = ReportItem.create({ locationId, name });
    const item = itemOrError.value as ReportItem;

    expect(itemOrError.isRight()).toBeTruthy();
    expect(item.name.value).toBe(name);
    expect(item.locationId.value).toBe(locationId);
  });
});

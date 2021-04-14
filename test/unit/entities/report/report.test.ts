import * as faker from 'faker';
import { Status } from '@entities/report/status';
import { getObjectWithNullProperty } from '@test/test-helpers/get-object-with-null-property';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { NullValueError } from '@entities/shared/errors/null-value-error';
import { TooLongDescriptionError } from '@entities/report/description/errors/too-long-description-error';
import { Description } from '@entities/report/description/description';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { ReportData } from '@entities/report/report-data';
import { Report } from '@entities/report/report';

describe('Report entity tests', () => {
  const example: ReportData = {
    id: faker.random.uuid(),
    createdAt: Date.now(),
    creatorId: faker.random.uuid(),
    itemLocationId: faker.random.uuid(),
    itemName: faker.commerce.productName(),
    description:
      'A description for the brand new report. Some item might be broken.',
    title: 'Title of this report.',
    image: faker.image.image(),
    status: Status.PENDING,
  };

  const getReportDataWithNullProperty = getObjectWithNullProperty(example);

  it('should have a valid id.', () => {
    const data = getReportDataWithNullProperty('id');
    const reportOrError = Report.create(data);

    expect(reportOrError.isLeft()).toBeTruthy();
    expect(reportOrError.value).toStrictEqual(
      new InvalidParamError('id', new NullValueError()),
    );
  });

  it('should have a creation date.', () => {
    const data = getReportDataWithNullProperty('createdAt');
    const reportOrError = Report.create(data);

    expect(reportOrError.isLeft()).toBeTruthy();
    expect(reportOrError.value).toStrictEqual(
      new MissingParamError('createdAt'),
    );
  });

  it('should have a creatorId.', () => {
    const data = getReportDataWithNullProperty('creatorId');
    const reportOrError = Report.create(data);

    expect(reportOrError.isLeft()).toBeTruthy();
    expect(reportOrError.value).toStrictEqual(
      new InvalidParamError('creatorId', new NullValueError()),
    );
  });

  it('should have a report item associated with it.', () => {
    const data1 = getReportDataWithNullProperty('itemName');
    const data2 = getReportDataWithNullProperty('itemLocationId');
    const reportOrError1 = Report.create(data1);
    const reportOrError2 = Report.create(data2);

    expect(reportOrError1.isLeft()).toBeTruthy();
    expect(reportOrError2.isLeft()).toBeTruthy();
  });

  it('should have a description.', () => {
    const data = {
      ...example,
      description: 'a'.repeat(Description.MAX_LENGTH + 1),
    };
    const reportOrError = Report.create(data);

    expect(reportOrError.isLeft()).toBeTruthy();
    expect(reportOrError.value).toStrictEqual(
      new InvalidParamError(
        'description',
        new TooLongDescriptionError(Description.MAX_LENGTH),
      ),
    );
  });

  it('should have a title.', () => {
    const data = getReportDataWithNullProperty('title');
    const reportOrError = Report.create(data);

    expect(reportOrError.isLeft()).toBeTruthy();
    expect(reportOrError.value).toStrictEqual(
      new InvalidParamError('title', new NullValueError()),
    );
  });

  it('should have an image.', () => {
    const data = getReportDataWithNullProperty('image');
    const reportOrError = Report.create(data);

    expect(reportOrError.isLeft()).toBeTruthy();
    expect(reportOrError.value).toStrictEqual(new MissingParamError('image'));
  });

  it('should have a status.', () => {
    const data = getReportDataWithNullProperty('status');
    const reportOrError = Report.create(data);

    expect(reportOrError.isLeft()).toBeTruthy();
    expect(reportOrError.value).toStrictEqual(new MissingParamError('status'));
  });

  it('should create a report instance.', () => {
    const reportOrError = Report.create(example);
    const report = reportOrError.value as Report;

    expect(reportOrError.isRight()).toBeTruthy();
    expect(report.title.value).toBe(example.title);
    expect(report.description.value).toBe(example.description);
    expect(report.item.name.value).toBe(example.itemName);
    expect(report.item.locationId.value).toBe(example.itemLocationId);
    expect(report.status).toBe(example.status);
    expect(report.createdAt).toBe(example.createdAt);
    expect(report.image).toBe(example.image);
    expect(report.creatorId.value).toBe(example.creatorId);
    expect(report.id.value).toBe(example.id);
  });
});
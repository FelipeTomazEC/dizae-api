import { Description } from '@entities/report/description/description';
import { TooLongDescriptionError } from '@entities/report/description/errors/too-long-description-error';
import { Report } from '@entities/report/report';
import { ReportData } from '@entities/report/report-data';
import { Status } from '@entities/report/status';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { NullValueError } from '@entities/shared/errors/null-value-error';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { getObjectWithNullProperty } from '@test/test-helpers/get-object-with-null-property';
import * as faker from 'faker';

describe('Report entity tests', () => {
  const example: ReportData = {
    id: faker.datatype.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(0),
    creatorId: faker.datatype.uuid(),
    itemLocationId: faker.datatype.uuid(),
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

  it('should have an updated at value.', () => {
    const data1 = getReportDataWithNullProperty('updatedAt');
    const report1 = Report.create(data1).value as Report;
    const report2 = Report.create(example).value as Report;

    expect(report1.updatedAt).toEqual(data1.createdAt);
    expect(report2.updatedAt).toEqual(example.updatedAt);
  });

  it('should change the status of the report.', () => {
    const report1 = Report.create(example).value as Report;
    const report2 = Report.create(example).value as Report;
    report1.changeReportStatus(Status.REJECTED);
    report2.changeReportStatus(Status.SOLVED);

    expect(report1.status).toBe(Status.REJECTED);
    expect(report1.updatedAt).not.toEqual(example.updatedAt);
    expect(report2.status).toBe(Status.SOLVED);
    expect(report2.updatedAt).not.toEqual(example.updatedAt);
  });

  it('should not change the status in final states.', () => {
    const solved = Report.create({ ...example, status: Status.SOLVED })
      .value as Report;
    const rejected = Report.create({ ...example, status: Status.REJECTED })
      .value as Report;
    solved.changeReportStatus(Status.PENDING);
    solved.changeReportStatus(Status.REJECTED);
    rejected.changeReportStatus(Status.PENDING);
    rejected.changeReportStatus(Status.SOLVED);

    expect(solved.status).toBe(Status.SOLVED);
    expect(solved.updatedAt).toBe(example.updatedAt);
    expect(rejected.status).toBe(Status.REJECTED);
    expect(rejected.updatedAt).toBe(example.updatedAt);
  });
});

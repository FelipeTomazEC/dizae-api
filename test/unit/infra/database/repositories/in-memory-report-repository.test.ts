import { Report } from '@entities/report/report';
import { Status } from '@entities/report/status';
import { InMemoryReportRepository } from '@infra/database/repositories/in-memory-report-repository';
import { generateRandomCollection } from '@test/test-helpers/generate-random-collection';
import {
  GetReportsFilters,
  ReportRepository,
} from '@use-cases/interfaces/repositories/report';
import { Pagination } from '@use-cases/shared/pagination-settings';
import faker from 'faker';

describe('In memory report repository tests.', () => {
  const sut: ReportRepository = InMemoryReportRepository.getInstance();

  const report = Report.create({
    createdAt: Date.now(),
    creatorId: faker.datatype.uuid(),
    description: faker.lorem.words(5),
    id: faker.datatype.uuid(),
    image: faker.image.image(),
    itemLocationId: faker.datatype.uuid(),
    itemName: faker.commerce.product(),
    status: Status.PENDING,
    title: faker.lorem.words(3),
  }).value as Report;

  it('should return the reports according to pagination.', async () => {
    const reports = generateRandomCollection(
      () =>
        Report.create({
          createdAt: Math.floor(1000 + Math.random() * 9929),
          creatorId: faker.datatype.uuid(),
          description: 'Some fake description',
          id: faker.datatype.uuid(),
          image: faker.image.image(),
          itemLocationId: faker.datatype.uuid(),
          itemName: faker.commerce.product(),
          status: Status.REJECTED,
          title: 'Some fake title',
        }).value as Report,
      1000,
    );

    await Promise.all(reports.map((r) => sut.save(r)));

    const ordered = [...reports].sort((a, b) => a.createdAt - b.createdAt);
    const firstPage = await sut.getAll({}, new Pagination(0, 5));
    const secondPage = await sut.getAll({}, new Pagination(5, 12));

    expect(firstPage).toStrictEqual(ordered.splice(0, 5));
    expect(secondPage).toStrictEqual(ordered.splice(0, 12));
  });

  it('should filter correctly.', async () => {
    const report1 = Report.create({
      createdAt: 1,
      creatorId: faker.datatype.uuid(),
      description: faker.lorem.words(3),
      id: faker.datatype.uuid(),
      image: faker.image.image(),
      itemLocationId: faker.datatype.uuid(),
      itemName: faker.commerce.product(),
      status: Status.PENDING,
      title: faker.lorem.words(2),
    }).value as Report;

    const report2 = Report.create({
      createdAt: 12,
      creatorId: faker.datatype.uuid(),
      description: faker.lorem.words(5),
      id: faker.datatype.uuid(),
      image: faker.image.image(),
      itemLocationId: faker.datatype.uuid(),
      itemName: faker.commerce.product(),
      status: Status.SOLVED,
      title: faker.lorem.words(2),
    }).value as Report;

    await sut.save(report1);
    await sut.save(report2);

    const pagination = new Pagination(0, 10);
    const location1 = report1.item.locationId.value;
    const location2 = report2.item.locationId.value;
    const filter1: GetReportsFilters = {
      status: [Status.PENDING, Status.SOLVED],
    };
    const filter2: GetReportsFilters = { locationsIds: [location1, location2] };
    const filter3: GetReportsFilters = { since: 0, status: [Status.SOLVED] };

    const result1 = await sut.getAll(filter1, pagination);
    const result2 = await sut.getAll(filter2, pagination);
    const result3 = await sut.getAll(filter3, pagination);

    expect(result1).toStrictEqual([report1, report2]);
    expect(result2).toStrictEqual([report1, report2]);
    expect(result3).toStrictEqual([report2]);
  });

  it('should save the reports.', async () => {
    await expect(sut.save(report)).resolves.not.toThrow();
  });

  it('should be a singleton.', async () => {
    const instance1 = InMemoryReportRepository.getInstance();
    const instance2 = InMemoryReportRepository.getInstance();

    expect(instance1).toBe(instance2);
  });
});

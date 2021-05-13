import { Report } from '@entities/report/report';
import { Status } from '@entities/report/status';
import { InMemoryReportRepository } from '@infra/database/repositories/in-memory-report-repository';
import { ReportRepository } from '@use-cases/interfaces/repositories/report';
import faker from 'faker';

describe('In memory report repository tests.', () => {
  const sut: ReportRepository = InMemoryReportRepository.getInstance();

  const report = Report.create({
    createdAt: Date.now(),
    creatorId: faker.datatype.uuid(),
    description: faker.lorem.words(10),
    id: faker.datatype.uuid(),
    image: faker.image.image(),
    itemLocationId: faker.datatype.uuid(),
    itemName: faker.commerce.product(),
    status: Status.PENDING,
    title: faker.lorem.words(3),
  }).value as Report;

  it('should save the reports.', async () => {
    await expect(sut.save(report)).resolves.not.toThrow();
  });

  it('should be a singleton.', async () => {
    const instance1 = InMemoryReportRepository.getInstance();
    const instance2 = InMemoryReportRepository.getInstance();

    expect(instance1).toBe(instance2);
  });
});

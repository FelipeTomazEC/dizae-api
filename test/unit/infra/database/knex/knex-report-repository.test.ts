import { Admin } from '@entities/admin/admin';
import { ItemCategory } from '@entities/item-category/item-category';
import { Item } from '@entities/location/item/item';
import { Location } from '@entities/location/location';
import { Report } from '@entities/report/report';
import { Status } from '@entities/report/status';
import { Reporter } from '@entities/reporter/reporter';
import { Timestamp } from '@entities/shared/renamed-primitive-types';
import { KnexAdminRepository } from '@infra/database/knex/repositories/knex-admin-repository';
import { KnexItemCategoryRepository } from '@infra/database/knex/repositories/knex-item-category-repository';
import { KnexLocationRepository } from '@infra/database/knex/repositories/knex-location-repository';
import { KnexReportRepository } from '@infra/database/knex/repositories/knex-report-repository';
import { KnexReporterRepository } from '@infra/database/knex/repositories/knex-reporter-repository';
import { setupKnexConnection } from '@infra/database/knex/setup-knex-connection';
import { generateRandomCollection } from '@test/test-helpers/generate-random-collection';
import { GetReportsFilters } from '@use-cases/interfaces/repositories/report';
import { Pagination } from '@use-cases/shared/pagination-settings';
import faker from 'faker';

describe('Knex report repository tests.', () => {
  const connection = setupKnexConnection('test');
  const sut = new KnexReportRepository(connection);

  const admin = Admin.create({
    avatar: faker.image.avatar(),
    createdAt: Date.now(),
    email: faker.internet.email(),
    id: faker.datatype.uuid(),
    name: 'Admin Test',
    password: 'som3pa$$word',
  }).value as Admin;

  const createLocation = () =>
    Location.create({
      createdAt: Date.now(),
      creatorId: admin.id.value,
      id: faker.datatype.uuid(),
      name: faker.commerce.department(),
    }).value as Location;

  const reporter = Reporter.create({
    avatar: faker.image.avatar(),
    createdAt: Date.now(),
    email: faker.internet.email(),
    id: faker.datatype.uuid(),
    name: 'Reporter Test',
    password: 'som3#passw0rd',
  }).value as Reporter;

  const category = ItemCategory.create({
    createdAt: Date.now(),
    creatorId: admin.id.value,
    name: 'Category Tests',
  }).value as ItemCategory;

  const item = Item.create({
    categoryName: category.name.value,
    createdAt: Date.now(),
    creatorId: admin.id.value,
    image: faker.image.image(),
    name: 'Item Test',
  }).value as Item;

  const createReport = (
    status: Status,
    location: Location,
    createdAt?: Timestamp,
  ) =>
    Report.create({
      createdAt: createdAt ?? Math.floor(1000 + Math.random() * 9929),
      creatorId: reporter.id.value,
      description: 'Some fake description',
      id: faker.datatype.uuid(),
      image: faker.image.image(),
      itemLocationId: location.id.value,
      itemName: item.name.value,
      status,
      title: 'Some fake title',
    }).value as Report;

  const location1 = createLocation();
  const location2 = createLocation();
  const location3 = createLocation();

  beforeAll(async () => {
    await connection.migrate.latest();

    const adminRepo = new KnexAdminRepository(connection);
    const categoryRepo = new KnexItemCategoryRepository(connection);
    const reporterRepo = new KnexReporterRepository(connection);
    const locationRepo = new KnexLocationRepository(connection);

    location1.addItem(item);
    location2.addItem(item);
    location3.addItem(item);

    await adminRepo.save(admin);
    await categoryRepo.save(category);
    await reporterRepo.save(reporter);
    await locationRepo.save(location1);
    await locationRepo.save(location2);
    await locationRepo.save(location3);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('should return the reports according to pagination.', async () => {
    const reports = generateRandomCollection(
      () => createReport(Status.REJECTED, location1),
      1000,
    );

    await Promise.all(reports.map((r) => sut.save(r)));

    const ordered = [...reports].sort((a, b) => a.createdAt - b.createdAt);
    const firstPage = await sut.getAll({}, new Pagination(0, 5));
    const secondPage = await sut.getAll({}, new Pagination(5, 12));

    expect(firstPage).toMatchObject(ordered.splice(0, 5));
    expect(secondPage).toMatchObject(ordered.splice(0, 12));
  });

  it('should filter correctly.', async () => {
    const report1 = createReport(Status.PENDING, location2, 1);
    const report2 = createReport(Status.SOLVED, location3, 12);

    await sut.save(report1);
    await sut.save(report2);

    const pagination = new Pagination(0, 10);
    const locationId1 = report1.item.locationId.value;
    const locationId2 = report2.item.locationId.value;
    const filter1: GetReportsFilters = {
      status: [Status.PENDING, Status.SOLVED],
    };
    const filter2: GetReportsFilters = {
      locationsIds: [locationId1, locationId2],
    };
    const filter3: GetReportsFilters = { since: 0, status: [Status.SOLVED] };

    const result1 = await sut.getAll(filter1, pagination);
    const result2 = await sut.getAll(filter2, pagination);
    const result3 = await sut.getAll(filter3, pagination);

    expect(result1).toMatchObject([report1, report2]);
    expect(result2).toMatchObject([report1, report2]);
    expect(result3).toMatchObject([report2]);
  });

  it('should save the reports.', async () => {
    await expect(
      sut.save(createReport(Status.PENDING, location1)),
    ).resolves.not.toThrow();
  });
});
import { Admin } from '@entities/admin/admin';
import { Location } from '@entities/location/location';
import { Report } from '@entities/report/report';
import { Status } from '@entities/report/status';
import { Reporter } from '@entities/reporter/reporter';
import { generateRandomCollection } from '@test/test-helpers/generate-random-collection';
import { getMock } from '@test/test-helpers/get-mock';
import { GetReportsRequest } from '@use-cases/get-reports/dtos/get-reports-request';
import { GetReportsUseCase } from '@use-cases/get-reports/get-reports';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import {
  GetReportsFilters,
  ReportRepository,
} from '@use-cases/interfaces/repositories/report';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';
import { ResourceNotFoundError } from '@use-cases/shared/errors/resource-not-found-error';
import { Pagination } from '@use-cases/shared/pagination-settings';
import faker from 'faker';

describe('Get reports use case tests.', () => {
  const adminRepo = getMock<AdminRepository>(['getById']);
  const reporterRepo = getMock<ReporterRepository>(['getReporterById']);
  const reportRepo = getMock<ReportRepository>(['getAll']);
  const locationRepo = getMock<LocationRepository>(['getLocationById']);
  const presenter = getMock<UseCaseOutputPort<any>>(['failure', 'success']);
  const sut = new GetReportsUseCase({
    adminRepo,
    reporterRepo,
    reportRepo,
    locationRepo,
    presenter,
  });

  let admin: Admin;
  let location: Location;
  let reporterOne: Reporter;
  let reporterTwo: Reporter;
  let reporterOneReports: Report[];
  let reporterTwoReports: Report[];

  const makeRequest = (
    requesterId: string,
    start: number,
    offset: number,
  ): GetReportsRequest => ({
    status: [Status.PENDING, Status.REJECTED, Status.SOLVED],
    since: Date.now(),
    itemCategories: ['Infrastructure'],
    locationsIds: ['40c0da1b-49d1-432a-a456-b321d5118c4f'],
    requesterId,
    pagination: { start, offset },
  });

  beforeAll(() => {
    jest.spyOn(Date, 'now').mockReturnValue(Date.now());
    const createReporter = (name: string) =>
      Reporter.create({
        avatar: faker.image.avatar(),
        createdAt: Date.now(),
        email: `${name.split(' ')[0]}@email.com`,
        id: faker.datatype.uuid(),
        name,
        password: 'pASA$SA8rD',
      }).value as Reporter;

    reporterOne = createReporter('Reporter 1');
    reporterTwo = createReporter('Reporter 2');
    location = Location.create({
      createdAt: Date.now(),
      creatorId: faker.datatype.uuid(),
      id: faker.datatype.uuid(),
      name: faker.commerce.department(),
    }).value as Location;

    admin = Admin.create({
      avatar: faker.image.avatar(),
      createdAt: Date.now(),
      email: faker.internet.email(),
      id: faker.datatype.uuid(),
      name: 'Lobby',
      password: 'Som3Pa$$w0rd',
    }).value as Admin;

    location = Location.create({
      createdAt: Date.now(),
      creatorId: faker.datatype.uuid(),
      id: faker.datatype.uuid(),
      name: faker.commerce.department(),
    }).value as Location;

    const makeReport = (reporter: Reporter) => () =>
      Report.create({
        createdAt: Date.now(),
        id: faker.datatype.uuid(),
        creatorId: reporter.id.value,
        description: faker.lorem.words(6),
        title: 'Some user title',
        status: Status.PENDING,
        itemName: faker.commerce.product(),
        itemLocationId: location.id.value,
        image: faker.image.image(),
      }).value as Report;

    reporterOneReports = generateRandomCollection(makeReport(reporterOne), 30);
    reporterTwoReports = generateRandomCollection(makeReport(reporterTwo), 20);
    const all = reporterOneReports.concat(reporterTwoReports);

    jest.spyOn(reportRepo, 'getAll').mockResolvedValue(all);
    jest.spyOn(locationRepo, 'getLocationById').mockResolvedValue(location);
    jest
      .spyOn(adminRepo, 'getById')
      .mockImplementation((id) =>
        id.isEqual(admin.id)
          ? Promise.resolve(admin)
          : Promise.resolve(undefined),
      );
    jest.spyOn(reporterRepo, 'getReporterById').mockImplementation((id) => {
      const reporter = id.isEqual(reporterOne.id) ? reporterOne : reporterTwo;

      return Promise.resolve(reporter);
    });
  });

  it(`should not allow one reporter access another's reports.`, async () => {
    const request = makeRequest(
      reporterOne.id.value,
      0,
      reporterOneReports.length,
    );
    const reports = reporterOneReports.map((report) => ({
      title: report.title.value,
      description: report.description.value,
      createdAt: report.createdAt,
      item: report.item.name.value,
      status: Status.PENDING,
      location: location.name.value,
      id: report.id.value,
      image: report.image,
      reporterName: reporterOne.name.value,
    }));

    await sut.execute(request);

    expect(presenter.success).toBeCalledWith({ reports });
  });

  it('should allow an admin access all registered reports.', async () => {
    const request = makeRequest(admin.id.value, 0, 50);
    const allReports = reporterOneReports.concat(reporterTwoReports);
    const reports = allReports.map((report) => {
      const reporter = report.creatorId.isEqual(reporterOne.id)
        ? reporterOne
        : reporterTwo;

      return {
        title: report.title.value,
        description: report.description.value,
        createdAt: report.createdAt,
        item: report.item.name.value,
        status: Status.PENDING,
        location: location.name.value,
        id: report.id.value,
        image: report.image,
        reporterName: reporter.name.value,
      };
    });

    await sut.execute(request);

    expect(presenter.success).toBeCalledWith({ reports });
  });

  it('should call the repository with the specified filters and pagination options.', async () => {
    const [start, offset] = [15, 10];
    const request = makeRequest(admin.id.value, start, offset);
    const filters: GetReportsFilters = {
      status: request.status,
      since: request.since,
      itemCategories: request.itemCategories,
      locationsIds: request.locationsIds,
    };

    const pagination = new Pagination(start, offset);

    await sut.execute(request);

    expect(reportRepo.getAll).toBeCalledWith(filters, pagination);
  });

  it('should send a not found error if the id does not belong to a reporter or admin.', async () => {
    jest
      .spyOn(reporterRepo, 'getReporterById')
      .mockResolvedValueOnce(undefined);
    jest.spyOn(adminRepo, 'getById').mockResolvedValueOnce(undefined);
    const request = makeRequest(faker.datatype.uuid(), 0, 20);

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(new ResourceNotFoundError('User'));
  });

  it('should return a maximum of 50 reports per request.', async () => {
    const request = makeRequest(faker.datatype.uuid(), 10, 60);
    const filters: GetReportsFilters = {
      status: request.status,
      since: request.since,
      itemCategories: request.itemCategories,
      locationsIds: request.locationsIds,
    };

    const pagination = new Pagination(10, 50);

    await sut.execute(request);

    expect(reportRepo.getAll).toBeCalledWith(filters, pagination);
  });
});

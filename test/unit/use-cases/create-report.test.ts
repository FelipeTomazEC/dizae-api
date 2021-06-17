import { Item } from '@entities/location/item/item';
import { Location } from '@entities/location/location';
import { Reporter } from '@entities/reporter/reporter';
import { Id } from '@entities/shared/id/id';
import { getMock } from '@test/test-helpers/get-mock';
import { CreateReportUseCase } from '@use-cases/create-report/create-report';
import { CreateReportRequest } from '@use-cases/create-report/dtos/create-report-request';
import { CreateReportResponse } from '@use-cases/create-report/dtos/create-report-response';
import { IdGenerator } from '@use-cases/interfaces/adapters/id-generator';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import { ReportRepository } from '@use-cases/interfaces/repositories/report';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';
import { ResourceNotFoundError } from '@use-cases/shared/errors/resource-not-found-error';
import * as faker from 'faker';

describe('Create report use case tests.', () => {
  const reportRepository = getMock<ReportRepository>(['save']);
  const locationRepository = getMock<LocationRepository>(['getLocationById']);
  const reporterRepository = getMock<ReporterRepository>(['getReporterById']);
  const idGenerator = getMock<IdGenerator>(['generate']);
  const presenter = getMock<UseCaseOutputPort<CreateReportResponse>>([
    'failure',
    'success',
  ]);

  const sut = new CreateReportUseCase({
    idGenerator,
    locationRepository,
    presenter,
    reporterRepository,
    reportRepository,
  });

  let item: Item;
  let reporter: Reporter;
  let location: Location;
  let id: Id;

  const request: CreateReportRequest = {
    description: faker.lorem.sentence(5),
    image: faker.image.image(),
    itemName: faker.commerce.product(),
    locationId: faker.datatype.uuid(),
    reporterId: faker.datatype.uuid(),
    title: faker.lorem.words(2),
  };

  beforeAll(() => {
    reporter = Reporter.create({
      name: 'Test User',
      createdAt: Date.now(),
      avatar: faker.internet.avatar(),
      email: faker.internet.email(),
      id: request.reporterId,
      password: 'som3Pa$$word1221',
    }).value as Reporter;

    location = Location.create({
      name: faker.commerce.department(),
      creatorId: faker.datatype.uuid(),
      id: request.locationId,
      createdAt: new Date(),
    }).value as Location;

    item = Item.create({
      categoryName: faker.commerce.productMaterial(),
      createdAt: new Date(),
      creatorId: faker.datatype.uuid(),
      image: faker.image.image(),
      name: request.itemName,
    }).value as Item;

    id = Id.create({ value: faker.datatype.uuid() }).value as Id;

    location.addItem(item);

    jest
      .spyOn(locationRepository, 'getLocationById')
      .mockResolvedValue(location);
    jest
      .spyOn(reporterRepository, 'getReporterById')
      .mockResolvedValue(reporter);
    jest.spyOn(idGenerator, 'generate').mockReturnValue(id);
    jest.spyOn(Date, 'now').mockReturnValue(Date.now());
  });

  it('should verify if the reporter exists.', async () => {
    jest
      .spyOn(reporterRepository, 'getReporterById')
      .mockResolvedValueOnce(undefined);

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(
      new ResourceNotFoundError('reporter'),
    );
  });

  it('should verify if the location exists.', async () => {
    jest
      .spyOn(locationRepository, 'getLocationById')
      .mockResolvedValueOnce(undefined);

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(
      new ResourceNotFoundError('location'),
    );
  });

  it('should verify if the item exists in the location.', async () => {
    await sut.execute({ ...request, itemName: 'Not Registered Item' });

    expect(presenter.failure).toBeCalledWith(new ResourceNotFoundError('item'));
  });

  it('should save the new report in the repository and return its id.', async () => {
    await sut.execute(request);

    expect(reportRepository.save).toBeCalled();
    expect(presenter.success).toBeCalledWith({
      newReportId: id.value,
    });
  });
});

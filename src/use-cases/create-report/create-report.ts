import { Report } from '@entities/report/report';
import { Status } from '@entities/report/status';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { IdGenerator } from '@use-cases/interfaces/adapters/id-generator';
import { UseCaseInputPort } from '@use-cases/interfaces/ports/use-case-input-port';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import { ReportRepository } from '@use-cases/interfaces/repositories/report';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';
import { ResourceNotFoundError } from '@use-cases/shared/errors/resource-not-found-error';
import { getValueObjects } from '@utils/get-value-objects';
import { CreateReportRequest as Request } from './dtos/create-report-request';
import { CreateReportResponse } from './dtos/create-report-response';

interface Dependencies {
  idGenerator: IdGenerator;
  locationRepository: LocationRepository;
  presenter: UseCaseOutputPort<CreateReportResponse>;
  reportRepository: ReportRepository;
  reporterRepository: ReporterRepository;
}

export class CreateReportUseCase implements UseCaseInputPort<Request> {
  constructor(private readonly dependencies: Dependencies) {}

  async execute(request: Request): Promise<void> {
    const {
      presenter,
      reporterRepository,
      locationRepository,
    } = this.dependencies;
    const { idGenerator, reportRepository } = this.dependencies;

    const reporterIdOrError = Id.create({ value: request.reporterId });
    const locationIdOrError = Id.create({ value: request.locationId });
    const itemNameOrError = Name.create({ value: request.itemName });

    const validation = getValueObjects<[Name, Id, Id]>([
      { name: 'itemName', value: itemNameOrError },
      { name: 'reporterId', value: reporterIdOrError },
      { name: 'locationId', value: locationIdOrError },
    ]);

    if (validation.isLeft()) {
      return presenter.failure(validation.value);
    }

    const [itemName, reporterId, locationId] = validation.value;

    const reporter = await reporterRepository.getReporterById(reporterId);
    if (!reporter) {
      return presenter.failure(new ResourceNotFoundError('reporter'));
    }

    const location = await locationRepository.getLocationById(locationId);
    if (!location) {
      return presenter.failure(new ResourceNotFoundError('location'));
    }

    if (!location.isItemRegistered(itemName)) {
      return presenter.failure(new ResourceNotFoundError('item'));
    }

    const id = idGenerator.generate();
    const newReportOrError = Report.create({
      createdAt: new Date(),
      creatorId: reporter.id.value,
      description: request.description,
      itemLocationId: location.id.value,
      id: id.value,
      image: request.image,
      title: request.title,
      itemName: request.itemName,
      status: Status.PENDING,
    });

    if (newReportOrError.isLeft()) {
      return presenter.failure(newReportOrError.value);
    }

    const newReport = newReportOrError.value;
    await reportRepository.save(newReport);

    return presenter.success({ newReportId: newReport.id.value });
  }
}

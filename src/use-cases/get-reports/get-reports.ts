import { Reporter } from '@entities/reporter/reporter';
import { Id } from '@entities/shared/id/id';
import { UseCaseInputPort } from '@use-cases/interfaces/ports/use-case-input-port';
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
import { GetReportsRequest } from './dtos/get-reports-request';
import {
  GetReportsResponse,
  ReportBasicInfo,
} from './dtos/get-reports-response';

interface Dependencies {
  adminRepo: AdminRepository;
  reporterRepo: ReporterRepository;
  reportRepo: ReportRepository;
  locationRepo: LocationRepository;
  presenter: UseCaseOutputPort<GetReportsResponse>;
}

export class GetReportsUseCase implements UseCaseInputPort<GetReportsRequest> {
  constructor(private readonly dependencies: Dependencies) {}

  async execute(request: GetReportsRequest): Promise<void> {
    const { adminRepo, reporterRepo, presenter } = this.dependencies;
    const { reportRepo, locationRepo } = this.dependencies;
    const requesterIdOrError = Id.create({ value: request.requesterId });
    if (requesterIdOrError.isLeft()) {
      return presenter.failure(new ResourceNotFoundError('User'));
    }

    const user = await Promise.all([
      adminRepo.getById(requesterIdOrError.value),
      reporterRepo.getReporterById(requesterIdOrError.value),
    ]).then((results) => results.find((res) => !!res));

    if (!user) {
      return presenter.failure(new ResourceNotFoundError('User'));
    }

    const { start, offset } = request.pagination ?? { start: 0, offset: 50 };
    const numberOfReportsToRetrieve = offset > 50 ? 50 : offset;
    const pagination = new Pagination(start, numberOfReportsToRetrieve);
    const filters: GetReportsFilters = {
      itemCategories: request.itemCategories,
      locationsIds: request.locationsIds,
      since: request.since,
      status: request.status,
    };

    let reports = await reportRepo.getAll(filters, pagination);
    if (user instanceof Reporter) {
      reports = reports.filter((r) => r.creatorId.isEqual(user.id));
    }

    const responseReportsData: Promise<ReportBasicInfo>[] = reports.map(
      async (r) => {
        const location = await locationRepo.getLocationById(r.item.locationId);
        const reporter = await reporterRepo.getReporterById(r.creatorId);

        return {
          id: r.id.value,
          title: r.title.value,
          status: r.status,
          createdAt: r.createdAt.getTime(),
          updatedAt: r.updatedAt.getTime(),
          item: {
            name: r.item.name.value,
            location: location!.name.value,
          },
          reporter: {
            id: reporter!.id.value,
            name: reporter!.name.value,
            avatar: reporter!.avatar,
          },
        };
      },
    );

    const fulfilledResponse = await Promise.all(responseReportsData);

    return presenter.success({ reports: fulfilledResponse });
  }
}

import { Admin } from '@entities/admin/admin';
import { Report } from '@entities/report/report';
import { Id } from '@entities/shared/id/id';
import { UseCaseInputPort } from '@use-cases/interfaces/ports/use-case-input-port';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';
import { GetByIdRepository } from '@use-cases/interfaces/repositories/common/get-by-id-repository';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';
import { AccessDeniedError } from '@use-cases/shared/errors/access-denied-error';
import { ResourceNotFoundError } from '@use-cases/shared/errors/resource-not-found-error';
import { GetSingleReportRequest as Request } from './dtos/get-single-report-request';
import { GetSingleReportResponse as Response } from './dtos/get-single-report-response';

interface Dependencies {
  reportRepo: GetByIdRepository<Report>;
  adminRepo: AdminRepository;
  reporterRepo: ReporterRepository;
  locationRepo: LocationRepository;
  presenter: UseCaseOutputPort<Response>;
}

export class GetSingleReportUseCase implements UseCaseInputPort<Request> {
  constructor(private readonly dependencies: Dependencies) {}

  async execute(request: Request): Promise<void> {
    const { reportRepo, presenter, reporterRepo } = this.dependencies;
    const { locationRepo, adminRepo } = this.dependencies;

    const idOrError = Id.create({ value: request.reportId });
    if (idOrError.isLeft()) {
      return presenter.failure(new ResourceNotFoundError('Report'));
    }

    const report = await reportRepo.getById(idOrError.value);
    if (!report) {
      return presenter.failure(new ResourceNotFoundError('Report'));
    }

    const requesterIdOrError = Id.create({ value: request.requesterId });
    if (requesterIdOrError.isLeft()) {
      return presenter.failure(new ResourceNotFoundError('User'));
    }

    const user = (
      await Promise.all([
        adminRepo.getById(requesterIdOrError.value),
        reporterRepo.getReporterById(requesterIdOrError.value),
      ])
    ).find((res) => !!res);

    if (!user) {
      return presenter.failure(new ResourceNotFoundError('User'));
    }

    const isUserAllowedToAccessReport =
      user instanceof Admin || user.id.isEqual(report.creatorId);

    if (!isUserAllowedToAccessReport) {
      return presenter.failure(new AccessDeniedError());
    }

    const reporter =
      user instanceof Admin
        ? await reporterRepo.getReporterById(report.creatorId)
        : user;

    const location = await locationRepo.getLocationById(report.item.locationId);

    return presenter.success({
      title: report.title.value,
      description: report.description.value,
      status: report.status,
      createdAt: report.createdAt.getTime(),
      image: report.image,
      updatedAt: report.updatedAt.getTime(),
      item: {
        name: report.item.name.value,
        location: location!.name.value,
      },
      reporter: {
        avatar: reporter!.avatar,
        id: reporter!.id.value,
        name: reporter!.name.value,
      },
    });
  }
}

import { Report } from '@entities/report/report';
import { Status } from '@entities/report/status';
import { Id } from '@entities/shared/id/id';
import { UseCaseInputPort } from '@use-cases/interfaces/ports/use-case-input-port';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { GetByIdRepository } from '@use-cases/interfaces/repositories/common/get-by-id-repository';
import { UpdateRepository } from '@use-cases/interfaces/repositories/common/update-repository';
import { isNullOrUndefined } from '@utils/is-null-or-undefined';
import { ChangeReportStatusRequest as Request } from './dtos/change-report-status-request';
import { InvalidStatusError } from './errors/invalid-status-error';
import { ReportNotFoundError } from './errors/report-not-found-error';

interface Dependencies {
  reportUpdateRepo: UpdateRepository<Report>;
  reportGetByIdRepo: GetByIdRepository<Report>;
  presenter: UseCaseOutputPort<void>;
}

export class ChangeReportStatusUseCase implements UseCaseInputPort<Request> {
  constructor(private readonly dependencies: Dependencies) {}

  async execute(request: Request): Promise<void> {
    const {
      reportGetByIdRepo,
      reportUpdateRepo,
      presenter,
    } = this.dependencies;
    const idOrError = Id.create({ value: request.reportId });

    if (idOrError.isLeft()) {
      return presenter.failure(new ReportNotFoundError());
    }

    const report = await reportGetByIdRepo.getById(idOrError.value);
    if (isNullOrUndefined(report)) {
      return presenter.failure(new ReportNotFoundError());
    }

    const isValidStatus = Object.values(Status).includes(request.newStatus);
    if (!isValidStatus) {
      return presenter.failure(new InvalidStatusError());
    }

    report?.changeReportStatus(request.newStatus);

    await reportUpdateRepo.update(report!);

    return presenter.success();
  }
}

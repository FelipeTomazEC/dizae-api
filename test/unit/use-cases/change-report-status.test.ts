import { Report } from '@entities/report/report';
import { Status } from '@entities/report/status';
import { Id } from '@entities/shared/id/id';
import { getMock } from '@test/test-helpers/get-mock';
import { ChangeReportStatusUseCase } from '@use-cases/change-report-status/change-report-status';
import { InvalidStatusError } from '@use-cases/change-report-status/errors/invalid-status-error';
import { ReportNotFoundError } from '@use-cases/change-report-status/errors/report-not-found-error';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { GetByIdRepository } from '@use-cases/interfaces/repositories/common/get-by-id-repository';
import { UpdateRepository } from '@use-cases/interfaces/repositories/common/update-repository';
import faker from 'faker';

describe('Change report status use case tests.', () => {
  const reportUpdateRepo = getMock<UpdateRepository<Report>>(['update']);
  const reportGetByIdRepo = getMock<GetByIdRepository<Report>>(['getById']);
  const presenter = getMock<UseCaseOutputPort<any>>(['success', 'failure']);
  const sut = new ChangeReportStatusUseCase({
    reportGetByIdRepo,
    reportUpdateRepo,
    presenter,
  });

  let report: Report;

  const request = {
    reportId: faker.datatype.uuid(),
    newStatus: Status.SOLVED,
  };

  beforeAll(() => {
    report = Report.create({
      createdAt: new Date(),
      creatorId: faker.datatype.uuid(),
      description: 'Some random description here',
      id: request.reportId,
      image: faker.image.image(),
      itemLocationId: faker.datatype.uuid(),
      itemName: 'Chair',
      status: Status.PENDING,
      title: 'Some problem here',
    }).value as Report;

    jest.spyOn(reportGetByIdRepo, 'getById').mockResolvedValue(report);
  });

  it('should validate if the passed status is valid.', async () => {
    await sut.execute({ ...request, newStatus: 54445 });

    expect(presenter.failure).toBeCalledWith(new InvalidStatusError());
  });

  it('should load the report from the repository.', async () => {
    const id = Id.create({ value: request.reportId }).value as Id;
    await sut.execute(request);

    expect(reportGetByIdRepo.getById).toBeCalledWith(id);
  });

  it('should update the report status.', async () => {
    const fakeReport = ({ changeReportStatus: jest.fn() } as unknown) as Report;
    jest.spyOn(reportGetByIdRepo, 'getById').mockResolvedValueOnce(fakeReport);

    await sut.execute(request);

    expect(fakeReport.changeReportStatus).toBeCalledWith(request.newStatus);
  });

  it('should return a report not found error if the report is not in the repository.', async () => {
    jest.spyOn(reportGetByIdRepo, 'getById').mockResolvedValueOnce(null);

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(new ReportNotFoundError());
  });

  it('should return not found if the id is not valid.', async () => {
    await sut.execute({ newStatus: Status.SOLVED, reportId: 'not-id' });

    expect(presenter.failure).toBeCalledWith(new ReportNotFoundError());
  });

  it('should save the updated report and call the presenter.', async () => {
    await sut.execute(request);

    expect(reportUpdateRepo.update).toBeCalled();
    expect(presenter.success).toBeCalled();
  });
});

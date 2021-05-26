import { Report } from '@entities/report/report';
import {
  GetReportsFilters,
  ReportRepository,
} from '@use-cases/interfaces/repositories/report';
import { Pagination } from '@use-cases/shared/pagination-settings';

export class InMemoryReportRepository implements ReportRepository {
  private static instance: InMemoryReportRepository | null = null;

  private readonly records: Map<string, Report>;

  private constructor() {
    this.records = new Map();
  }

  static getInstance(): InMemoryReportRepository {
    if (!this.instance) {
      this.instance = new InMemoryReportRepository();
    }

    return this.instance;
  }

  save(report: Report): Promise<void> {
    const key = report.id.value;
    this.records.set(key, report);
    return Promise.resolve();
  }

  getAll(
    filters: GetReportsFilters,
    pagination: Pagination,
  ): Promise<Report[]> {
    const { status, since, locationsIds } = filters;
    const result = Array.from(this.records.values())
      .sort((r1, r2) => r1.createdAt - r2.createdAt)
      .filter(
        (r) =>
          !locationsIds ||
          locationsIds.some((l) => r.item.locationId.value === l),
      )
      .filter((r) => !status || status.some((s) => r.status === s))
      .filter((r) => !since || r.createdAt >= since);

    return Promise.resolve(result.splice(pagination.start, pagination.offset));
  }
}

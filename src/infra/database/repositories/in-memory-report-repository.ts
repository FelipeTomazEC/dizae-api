import { Report } from '@entities/report/report';
import { ReportRepository } from '@use-cases/interfaces/repositories/report';

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
}

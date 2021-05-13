import { Report } from '@entities/report/report';
import { ReportRepository } from '@use-cases/interfaces/repositories/report';

export class InMemoryReportRepository implements ReportRepository {
  private static instance: InMemoryReportRepository | null = null;

  private readonly records: Report[];

  private constructor() {
    this.records = [];
  }

  static getInstance(): InMemoryReportRepository {
    if (!this.instance) {
      this.instance = new InMemoryReportRepository();
    }

    return this.instance;
  }

  save(report: Report): Promise<void> {
    this.records.push(report);
    return Promise.resolve();
  }
}

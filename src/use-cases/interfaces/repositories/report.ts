import { Report } from '@entities/report/report';

export interface ReportRepository {
  save(report: Report): Promise<void>;
}

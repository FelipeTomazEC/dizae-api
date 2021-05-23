import { Report } from '@entities/report/report';
import { Status } from '@entities/report/status';
import { Timestamp } from '@entities/shared/renamed-primitive-types';
import { Pagination } from '@use-cases/shared/pagination-settings';

export interface GetReportsFilters {
  status?: Status[];
  locationsIds?: string[];
  since?: Timestamp;
  itemCategories?: string[];
}

export interface ReportRepository {
  save(report: Report): Promise<void>;
  getAll(filters: GetReportsFilters, pagination: Pagination): Promise<Report[]>;
}

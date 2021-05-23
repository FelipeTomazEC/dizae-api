import { GetSingleReportResponse } from '@use-cases/shared/dtos/get-single-report-response';

export interface GetReportsResponse {
  reports: GetSingleReportResponse[];
}

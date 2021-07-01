import { Status } from '@entities/report/status';

export interface ChangeReportStatusRequest {
  reportId: string;
  newStatus: Status;
}

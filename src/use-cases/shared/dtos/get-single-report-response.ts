import { Status } from '@entities/report/status';
import { Timestamp } from '@entities/shared/renamed-primitive-types';

export interface GetSingleReportResponse {
  id: string;
  title: string;
  description: string;
  reporterName: string;
  createdAt: Timestamp;
  status: Status;
  location: string;
  item: string;
  image: string;
}

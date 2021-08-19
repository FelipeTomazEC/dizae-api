import { Status } from '@entities/report/status';
import { Timestamp } from '@entities/shared/renamed-primitive-types';

export interface ReportBasicInfo {
  id: string;
  title: string;
  status: Status;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  item: {
    name: string;
    location: string;
  };
  reporter: {
    name: string;
    avatar: string;
    id: string;
  };
}

export interface GetReportsResponse {
  reports: ReportBasicInfo[];
}

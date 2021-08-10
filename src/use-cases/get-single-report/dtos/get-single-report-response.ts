import { Status } from '@entities/report/status';
import { Timestamp, URL } from '@entities/shared/renamed-primitive-types';

export interface GetSingleReportResponse {
  title: string;
  description: string;
  status: Status;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  image: URL;
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

import { Timestamp, URL } from '@entities/shared/renamed-primitive-types';
import { Status } from '@entities/report/status';

export interface ReportData {
  id: string;
  createdAt: Timestamp;
  image: URL;
  creatorId: string;
  itemName: string;
  itemLocationId: string;
  description: string;
  title: string;
  status: Status;
}

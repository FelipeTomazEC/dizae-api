import { Status } from '@entities/report/status';
import { Timestamp, URL } from '@entities/shared/renamed-primitive-types';

export interface ReportSchema {
  id: string;
  title: string;
  description: string;
  reporter_id: string;
  location_id: string;
  item_name: string;
  image: URL;
  status: Status;
  created_at: Timestamp;
}

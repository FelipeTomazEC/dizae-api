import { Status } from '@entities/report/status';
import { Timestamp } from '@entities/shared/renamed-primitive-types';

export interface GetReportsRequest {
  status?: Status[];
  locationsIds?: string[];
  itemCategories?: string[];
  requesterId: string;
  since?: Timestamp;
  pagination?: {
    start: number;
    offset: number;
  };
}

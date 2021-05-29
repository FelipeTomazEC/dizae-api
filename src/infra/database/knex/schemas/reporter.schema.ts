import { Timestamp } from '@entities/shared/renamed-primitive-types';

export interface ReporterSchema {
  created_at: Timestamp;
  id: string;
  name: string;
  avatar: string;
  password: string;
  email: string;
}

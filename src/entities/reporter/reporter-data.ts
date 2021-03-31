import { Timestamp, URL } from '@entities/shared/renamed-primitive-types';

export interface ReporterData {
  id: string;
  name: string;
  email: string;
  createdAt: Timestamp;
  password: string;
  avatar: URL;
}

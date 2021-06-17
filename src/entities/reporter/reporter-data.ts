import { URL } from '@entities/shared/renamed-primitive-types';

export interface ReporterData {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  password: string;
  avatar: URL;
}

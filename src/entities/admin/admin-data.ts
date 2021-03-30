import { Timestamp, URL } from '@entities/shared/renamed-primitive-types';

export interface AdminData {
  id: string;
  name: string;
  createdAt: Timestamp;
  password: string;
  avatar: URL;
  email: string;
}

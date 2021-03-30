import { Timestamp, URL } from '@entities/shared/renamed-primitive-types';

export interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: Timestamp;
  password: string;
  avatar: URL;
}

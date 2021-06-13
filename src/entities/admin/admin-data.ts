import { URL } from '@entities/shared/renamed-primitive-types';

export interface AdminData {
  id: string;
  name: string;
  createdAt: Date;
  password: string;
  avatar: URL;
  email: string;
}

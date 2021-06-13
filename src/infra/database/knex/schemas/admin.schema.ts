import { URL } from '@entities/shared/renamed-primitive-types';

export interface AdminSchema {
  id: string;
  avatar: URL;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

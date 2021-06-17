import { URL } from '@entities/shared/renamed-primitive-types';

export interface AuthenticationResponse {
  name: string;
  avatar: URL;
  credentials: string;
  expiresIn: number;
}

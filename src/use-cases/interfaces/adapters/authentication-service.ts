import { Admin } from '@entities/admin/admin';
import { Reporter } from '@entities/reporter/reporter';

export interface AuthenticationService<T extends Admin | Reporter> {
  generateCredentials(user: T, ttl: number): Promise<string>;
}

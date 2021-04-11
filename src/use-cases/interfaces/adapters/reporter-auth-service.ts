import { Reporter } from '@entities/reporter/reporter';

export interface ReporterAuthService {
  generateCredentials(reporter: Reporter, ttl: number): Promise<string>;
}

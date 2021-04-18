import { Reporter } from '@entities/reporter/reporter';
import { Email } from '@entities/shared/email/email';
import { Id } from '@entities/shared/id/id';

export interface ReporterRepository {
  emailExists(email: Email): Promise<boolean>;
  save(reporter: Reporter): Promise<void>;
  getReporterByEmail(email: Email): Promise<Reporter | undefined>;
  getReporterById(id: Id): Promise<Reporter | undefined>;
}

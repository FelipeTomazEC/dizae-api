import { Email } from '@entities/shared/email/email';
import { Reporter } from '@entities/reporter/reporter';

export interface ReporterRepository {
  emailExists(email: Email): Promise<boolean>;
  save(reporter: Reporter): Promise<void>;
}

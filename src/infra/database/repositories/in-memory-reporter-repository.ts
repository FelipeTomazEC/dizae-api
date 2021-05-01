import { Reporter } from '@entities/reporter/reporter';
import { Email } from '@entities/shared/email/email';
import { Id } from '@entities/shared/id/id';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';

export class InMemoryReporterRepository implements ReporterRepository {
  private static instance: InMemoryReporterRepository | null = null;

  private readonly records: Reporter[];

  private constructor() {
    this.records = [];
  }

  static getInstance(): InMemoryReporterRepository {
    if (this.instance === null) {
      this.instance = new InMemoryReporterRepository();
    }

    return this.instance;
  }

  emailExists(email: Email): Promise<boolean> {
    const exists = this.records.some((r) => r.email.isEqual(email));
    return Promise.resolve(exists);
  }

  save(reporter: Reporter): Promise<void> {
    this.records.push(reporter);
    return Promise.resolve();
  }

  getReporterByEmail(email: Email): Promise<Reporter | undefined> {
    const reporter = this.records.find((r) => r.email.isEqual(email));
    return Promise.resolve(reporter);
  }

  getReporterById(id: Id): Promise<Reporter | undefined> {
    const reporter = this.records.find((r) => r.id.isEqual(id));
    return Promise.resolve(reporter);
  }
}

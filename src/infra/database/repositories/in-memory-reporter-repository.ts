import { Reporter } from '@entities/reporter/reporter';
import { Email } from '@entities/shared/email/email';
import { Id } from '@entities/shared/id/id';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';

export class InMemoryReporterRepository implements ReporterRepository {
  private static instance: InMemoryReporterRepository | null = null;

  private readonly records: Map<string, Reporter>;

  private constructor() {
    this.records = new Map();
  }

  static getInstance(): InMemoryReporterRepository {
    if (this.instance === null) {
      this.instance = new InMemoryReporterRepository();
    }

    return this.instance;
  }

  emailExists(email: Email): Promise<boolean> {
    const reporters = Array.from(this.records.values());
    const exists = reporters.some((r) => r.email.isEqual(email));
    return Promise.resolve(exists);
  }

  save(reporter: Reporter): Promise<void> {
    const key = reporter.id.value;
    this.records.set(key, reporter);
    return Promise.resolve();
  }

  getReporterByEmail(email: Email): Promise<Reporter | undefined> {
    const reporters = Array.from(this.records.values());
    return Promise.resolve(reporters.find((r) => r.email.isEqual(email)));
  }

  getReporterById(id: Id): Promise<Reporter | undefined> {
    return Promise.resolve(this.records.get(id.value));
  }
}

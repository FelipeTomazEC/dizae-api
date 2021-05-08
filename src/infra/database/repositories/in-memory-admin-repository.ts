import { Admin } from '@entities/admin/admin';
import { Email } from '@entities/shared/email/email';
import { Id } from '@entities/shared/id/id';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';

export class InMemoryAdminRepository implements AdminRepository {
  private static instance: InMemoryAdminRepository | null = null;

  private readonly records: Admin[];

  private constructor() {
    this.records = [];
  }

  static getInstance(): InMemoryAdminRepository {
    if (!this.instance) {
      this.instance = new InMemoryAdminRepository();
    }

    return this.instance;
  }

  getById(id: Id): Promise<Admin | undefined> {
    const admin = this.records.find((r) => r.id.isEqual(id));
    return Promise.resolve(admin);
  }

  emailExists(email: Email): Promise<boolean> {
    const exists = this.records.some((r) => r.email.isEqual(email));
    return Promise.resolve(exists);
  }

  save(admin: Admin): Promise<void> {
    this.records.push(admin);
    return Promise.resolve();
  }

  getByEmail(email: Email): Promise<Admin | undefined> {
    const admin = this.records.find((r) => r.email.isEqual(email));

    return Promise.resolve(admin);
  }
}

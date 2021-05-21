import { Admin } from '@entities/admin/admin';
import { Email } from '@entities/shared/email/email';
import { Id } from '@entities/shared/id/id';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';

export class InMemoryAdminRepository implements AdminRepository {
  private static instance: InMemoryAdminRepository | null = null;

  private readonly records: Map<string, Admin>;

  private constructor() {
    this.records = new Map();
  }

  static getInstance(): InMemoryAdminRepository {
    if (!this.instance) {
      this.instance = new InMemoryAdminRepository();
    }

    return this.instance;
  }

  getById(id: Id): Promise<Admin | undefined> {
    return Promise.resolve(this.records.get(id.value));
  }

  emailExists(email: Email): Promise<boolean> {
    const admins = Array.from(this.records.values());
    const exists = admins.some((r) => r.email.isEqual(email));
    return Promise.resolve(exists);
  }

  save(admin: Admin): Promise<void> {
    const key = admin.id.value;
    this.records.set(key, admin);
    return Promise.resolve();
  }

  getByEmail(email: Email): Promise<Admin | undefined> {
    const admins = Array.from(this.records.values());
    return Promise.resolve(admins.find((a) => a.email.isEqual(email)));
  }
}

import { Admin } from '@entities/admin/admin';
import { Email } from '@entities/shared/email/email';
import { Id } from '@entities/shared/id/id';

export interface AdminRepository {
  getById(id: Id): Promise<Admin | undefined>;
  emailExists(email: Email): Promise<boolean>;
  save(admin: Admin): Promise<void>;
}

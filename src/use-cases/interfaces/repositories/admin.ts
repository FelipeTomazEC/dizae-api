import { Admin } from '@entities/admin/admin';
import { Id } from '@entities/shared/id/id';

export interface AdminRepository {
  getById(id: Id): Promise<Admin | undefined>;
}

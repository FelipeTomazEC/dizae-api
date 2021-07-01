import { Id } from '@entities/shared/id/id';

export interface GetByIdRepository<T> {
  getById(id: Id): Promise<T | null>;
}

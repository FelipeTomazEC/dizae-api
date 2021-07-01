export interface UpdateRepository<T> {
  update(entity: T): Promise<void>;
}

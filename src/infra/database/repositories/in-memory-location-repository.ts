import { Location } from '@entities/location/location';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';

export class InMemoryLocationRepository implements LocationRepository {
  private static instance: InMemoryLocationRepository | null = null;

  private readonly records: Location[];

  private constructor() {
    this.records = [];
  }

  static getInstance(): InMemoryLocationRepository {
    if (this.instance === null) {
      this.instance = new InMemoryLocationRepository();
    }
    return this.instance;
  }

  getAll(): Promise<Location[]> {
    return Promise.resolve([...this.records]);
  }

  getLocationById(id: Id): Promise<Location | undefined> {
    const location = this.records.find((r) => r.id.isEqual(id));
    return Promise.resolve(location);
  }

  exists(name: Name): Promise<boolean> {
    const exists = this.records.some((r) => r.name.isEqual(name));
    return Promise.resolve(exists);
  }

  save(location: Location): Promise<void> {
    this.records.push(location);
    return Promise.resolve();
  }
}

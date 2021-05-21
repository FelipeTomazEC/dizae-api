import { Location } from '@entities/location/location';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';

export class InMemoryLocationRepository implements LocationRepository {
  private static instance: InMemoryLocationRepository | null = null;

  private readonly records: Map<string, Location>;

  private constructor() {
    this.records = new Map();
  }

  static getInstance(): InMemoryLocationRepository {
    if (this.instance === null) {
      this.instance = new InMemoryLocationRepository();
    }
    return this.instance;
  }

  getAll(): Promise<Location[]> {
    return Promise.resolve(Array.from(this.records.values()));
  }

  getLocationById(id: Id): Promise<Location | undefined> {
    return Promise.resolve(this.records.get(id.value));
  }

  exists(name: Name): Promise<boolean> {
    const exists = Array.from(this.records.values()).some((l) =>
      l.name.isEqual(name),
    );
    return Promise.resolve(exists);
  }

  save(location: Location): Promise<void> {
    const key = location.id.value;
    this.records.set(key, location);

    return Promise.resolve();
  }
}

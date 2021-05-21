import { Location } from '@entities/location/location';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';

export interface LocationRepository {
  getLocationById(id: Id): Promise<Location | undefined>;
  exists(name: Name): Promise<boolean>;
  save(location: Location): Promise<void>;
  getAll(): Promise<Location[]>;
}

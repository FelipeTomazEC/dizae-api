import { Location } from '@entities/location/location';
import { Id } from '@entities/shared/id/id';

export interface LocationRepository {
  getLocationById(id: Id): Promise<Location | undefined>;
}

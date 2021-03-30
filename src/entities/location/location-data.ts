import { Timestamp } from '@entities/shared/renamed-primitive-types';

export interface LocationData {
  id: string;
  createdAt: Timestamp;
  creatorId: string;
  name: string;
}

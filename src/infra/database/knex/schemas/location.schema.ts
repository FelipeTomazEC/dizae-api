import { Timestamp } from '@entities/shared/renamed-primitive-types';

export interface LocationSchema {
  id: string;
  name: string;
  created_at: Timestamp;
  creator_id: string;
}

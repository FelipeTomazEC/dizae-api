import { Id } from '@entities/shared/id/id';

export interface IdGenerator {
  generate(): Id;
}

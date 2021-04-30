import { Id } from '@entities/shared/id/id';
import { IdGenerator } from '@use-cases/interfaces/adapters/id-generator';
import { v4 as uuidV4 } from 'uuid';

export class UUIDV4Generator implements IdGenerator {
  public generate(): Id {
    return Id.create({ value: uuidV4() }).value as Id;
  }
}

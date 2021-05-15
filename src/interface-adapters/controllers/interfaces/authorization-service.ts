import { Id } from '@entities/shared/id/id';
import { Either } from '@shared/either.type';
import { AuthorizationError } from '../errors/authorization-error';

export type CredentialsOwnerId = Id;

export interface AuthorizationService {
  validate(
    credentials: string,
  ): Promise<Either<AuthorizationError, CredentialsOwnerId>>;
}

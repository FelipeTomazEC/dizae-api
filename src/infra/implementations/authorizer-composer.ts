import { Id } from '@entities/shared/id/id';
import { AuthorizationError } from '@interface-adapters/controllers/errors/authorization-error';
import { AuthorizationService } from '@interface-adapters/controllers/interfaces/authorization-service';
import { Either, left, right } from '@shared/either.type';

export class AuthorizerComposer implements AuthorizationService {
  private readonly authorizers: AuthorizationService[];

  constructor(...authorizers: AuthorizationService[]) {
    this.authorizers = authorizers;
  }

  async validate(credentials: string): Promise<Either<AuthorizationError, Id>> {
    const authorizationResponses = await Promise.all(
      this.authorizers.map((a) => a.validate(credentials)),
    );

    const successValidationResponse = authorizationResponses.find((r) =>
      r.isRight(),
    );
    if (!successValidationResponse) {
      return left(new AuthorizationError());
    }

    return right(successValidationResponse.value as Id);
  }
}

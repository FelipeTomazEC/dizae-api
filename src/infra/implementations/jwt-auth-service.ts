import { Admin } from '@entities/admin/admin';
import { Reporter } from '@entities/reporter/reporter';
import { Id } from '@entities/shared/id/id';
import { AuthorizationError } from '@interface-adapters/controllers/errors/authorization-error';
import { AuthorizationService } from '@interface-adapters/controllers/interfaces/authorization-service';
import { Either, left, right } from '@shared/either.type';
import { AuthenticationService } from '@use-cases/interfaces/adapters/authentication-service';
import { sign, SignOptions, verify } from 'jsonwebtoken';

interface TokenPayload {
  ownerId: string;
}

export class JWTAuthService
  implements AuthenticationService<Reporter | Admin>, AuthorizationService {
  constructor(private readonly secret: string) {}

  generateCredentials(
    user: Reporter | Admin,
    ttl: number = 3600,
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const options: SignOptions = {
        expiresIn: ttl,
      };

      const payload: TokenPayload = {
        ownerId: user.id.value,
      };

      sign(payload, this.secret, options, (err, token) => {
        if (err) {
          return reject(err);
        }

        return resolve(token!);
      });
    });
  }

  async validate(credentials: string): Promise<Either<AuthorizationError, Id>> {
    return new Promise((resolve) => {
      verify(credentials, this.secret, (error, payload) => {
        if (error) {
          return resolve(left(new AuthorizationError()));
        }
        const { ownerId } = payload as TokenPayload;
        const id = Id.create({ value: ownerId }).value;

        return resolve(right(id as Id));
      });
    });
  }
}

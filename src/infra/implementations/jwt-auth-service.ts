import { Admin } from '@entities/admin/admin';
import { Reporter } from '@entities/reporter/reporter';
import { AuthorizationService } from '@interface-adapters/controllers/interfaces/authorization-service';
import { AuthenticationService } from '@use-cases/interfaces/adapters/authentication-service';
import { sign, SignOptions, verify } from 'jsonwebtoken';

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

      const payload = {
        ownerId: user.id,
      };

      sign(payload, this.secret, options, (err, token) => {
        if (err) {
          return reject(err);
        }

        return resolve(token!);
      });
    });
  }

  validate(credentials: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      verify(credentials, this.secret, (_, decoded) => resolve(!!decoded));
    });
  }
}

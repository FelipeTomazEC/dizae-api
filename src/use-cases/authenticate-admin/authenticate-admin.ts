import { Admin } from '@entities/admin/admin';
import { Email } from '@entities/shared/email/email';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { Password } from '@entities/shared/password/password';
import { AuthenticationService } from '@use-cases/interfaces/adapters/authentication-service';
import { PasswordEncoder } from '@use-cases/interfaces/adapters/password-encoder';
import { UseCaseInputPort } from '@use-cases/interfaces/ports/use-case-input-port';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';
import { AuthenticationRequest as Request } from '@use-cases/shared/dtos/authentication-request';
import { AuthenticationResponse as Response } from '@use-cases/shared/dtos/authentication-response';
import { IncorrectPasswordError } from '@use-cases/shared/errors/incorrect-password-error';
import { AdminNotRegisteredError } from './errors/admin-not-registered-error';

interface Dependencies {
  authService: AuthenticationService<Admin>;
  encoder: PasswordEncoder;
  repository: AdminRepository;
  presenter: UseCaseOutputPort<Response>;
}

export class AuthenticateAdminUseCase implements UseCaseInputPort<Request> {
  constructor(private readonly dependencies: Dependencies) {}

  async execute(request: Request): Promise<void> {
    const { presenter, repository, encoder, authService } = this.dependencies;

    const emailOrError = Email.create({ value: request.email });
    if (emailOrError.isLeft()) {
      return presenter.failure(
        new InvalidParamError('email', emailOrError.value),
      );
    }

    const passwordOrError = Password.create({ value: request.password });
    if (passwordOrError.isLeft()) {
      return presenter.failure(new IncorrectPasswordError());
    }

    const email = emailOrError.value;
    const password = passwordOrError.value;

    const admin = await repository.getByEmail(email);
    if (!admin) {
      return presenter.failure(new AdminNotRegisteredError(email));
    }

    const isPasswordRight = await encoder.verify(password, admin!.password);
    if (!isPasswordRight) {
      return presenter.failure(new IncorrectPasswordError());
    }

    const credentials = await authService.generateCredentials(admin, 3600);

    return presenter.success({
      name: admin.name.value,
      avatar: admin.avatar,
      credentials,
      expiresIn: 3600,
    });
  }
}

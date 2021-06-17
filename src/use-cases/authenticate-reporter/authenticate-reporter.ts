import { UseCaseInputPort } from '@use-cases/interfaces/ports/use-case-input-port';
import { PasswordEncoder } from '@use-cases/interfaces/adapters/password-encoder';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';
import { AuthenticationService } from '@use-cases/interfaces/adapters/authentication-service';
import { Email } from '@entities/shared/email/email';
import { Password } from '@entities/shared/password/password';
import { ReporterNotRegisteredError } from '@use-cases/authenticate-reporter/errors/reporter-not-registered-error';
import { Reporter } from '@entities/reporter/reporter';
import { AuthenticationResponse as Response } from '@use-cases/shared/dtos/authentication-response';
import { AuthenticationRequest as Request } from '@use-cases/shared/dtos/authentication-request';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { IncorrectPasswordError } from '@use-cases/shared/errors/incorrect-password-error';

interface Dependencies {
  authService: AuthenticationService<Reporter>;
  encoder: PasswordEncoder;
  presenter: UseCaseOutputPort<Response>;
  repository: ReporterRepository;
}

export class AuthenticateReporterUseCase implements UseCaseInputPort<Request> {
  static readonly CREDENTIALS_TTL_IN_SECONDS = 3600;

  constructor(private readonly dependencies: Dependencies) {}

  async execute(request: Request): Promise<void> {
    const { authService, encoder, presenter, repository } = this.dependencies;
    const emailOrError = Email.create({ value: request.email });
    const passwordOrError = Password.create({ value: request.password });

    if (emailOrError.isLeft()) {
      return presenter.failure(
        new InvalidParamError('email', emailOrError.value),
      );
    }

    if (passwordOrError.isLeft()) {
      return presenter.failure(new IncorrectPasswordError());
    }

    const [email, password] = [emailOrError.value, passwordOrError.value];

    const reporter = await repository.getReporterByEmail(email);
    if (!reporter) {
      return presenter.failure(new ReporterNotRegisteredError(email));
    }

    const isPasswordCorrect = await encoder.verify(password, reporter.password);
    if (!isPasswordCorrect) {
      return presenter.failure(new IncorrectPasswordError());
    }

    const credentials = await authService.generateCredentials(
      reporter,
      AuthenticateReporterUseCase.CREDENTIALS_TTL_IN_SECONDS,
    );

    return presenter.success({
      avatar: reporter.avatar,
      name: reporter.name.value,
      credentials,
      expiresIn: AuthenticateReporterUseCase.CREDENTIALS_TTL_IN_SECONDS,
    });
  }
}

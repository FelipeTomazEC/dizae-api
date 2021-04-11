import { UseCaseInputPort } from '@use-cases/interfaces/ports/use-case-input-port';
import { AuthenticateReporterRequest as Request } from '@use-cases/authenticate-reporter/dtos/authenticate-reporter-request';
import { PasswordEncoder } from '@use-cases/interfaces/adapters/password-encoder';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { AuthenticateReporterResponse as Response } from '@use-cases/authenticate-reporter/dtos/authenticate-reporter-response';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';
import { ReporterAuthService } from '@use-cases/interfaces/adapters/reporter-auth-service';
import { Email } from '@entities/shared/email/email';
import { IncorrectEmailOrPasswordError } from '@use-cases/authenticate-reporter/errors/incorrect-email-or-password-error';
import { Password } from '@entities/shared/password/password';
import { ReporterNotRegisteredError } from '@use-cases/authenticate-reporter/errors/reporter-not-registered-error';

interface Dependencies {
  authService: ReporterAuthService;
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

    if (emailOrError.isLeft() || passwordOrError.isLeft()) {
      return presenter.failure(new IncorrectEmailOrPasswordError());
    }

    const [email, password] = [emailOrError.value, passwordOrError.value];

    const reporter = await repository.getReporterByEmail(email);
    if (!reporter) {
      return presenter.failure(new ReporterNotRegisteredError(email));
    }

    const isPasswordCorrect = await encoder.verify(password, reporter.password);
    if (!isPasswordCorrect) {
      return presenter.failure(new IncorrectEmailOrPasswordError());
    }

    const credentials = await authService.generateCredentials(
      reporter,
      AuthenticateReporterUseCase.CREDENTIALS_TTL_IN_SECONDS,
    );

    return presenter.success({
      credentials,
      expiresIn: AuthenticateReporterUseCase.CREDENTIALS_TTL_IN_SECONDS,
    });
  }
}

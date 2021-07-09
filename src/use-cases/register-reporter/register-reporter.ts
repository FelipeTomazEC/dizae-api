import { UseCaseInputPort } from '@use-cases/interfaces/ports/use-case-input-port';
import { RegisterReporterRequest as Request } from '@use-cases/register-reporter/dtos/register-reporter-request';
import { IdGenerator } from '@use-cases/interfaces/adapters/id-generator';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { RegisterReporterResponse } from '@use-cases/register-reporter/dtos/register-reporter-response';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';
import { PasswordEncoder } from '@use-cases/interfaces/adapters/password-encoder';
import { Reporter } from '@entities/reporter/reporter';
import { EmailAlreadyRegisteredError } from '@use-cases/shared/errors/email-already-registered-error';
import { ImageUploadService } from '@use-cases/interfaces/adapters/image-upload-service';

interface Dependencies {
  encoder: PasswordEncoder;
  idGenerator: IdGenerator;
  imageUploadService: ImageUploadService;
  presenter: UseCaseOutputPort<RegisterReporterResponse>;
  repository: ReporterRepository;
}

export class RegisterReporterUseCase implements UseCaseInputPort<Request> {
  constructor(private readonly dependencies: Dependencies) {}

  async execute(request: Request): Promise<void> {
    const { idGenerator, presenter, encoder, repository } = this.dependencies;
    const { imageUploadService } = this.dependencies;
    const id = idGenerator.generate();
    const avatarURL = await imageUploadService.upload(request.avatar, id.value);

    const reporterOrError = Reporter.create({
      id: id.value,
      email: request.email,
      avatar: avatarURL,
      name: request.name,
      createdAt: new Date(),
      password: request.password,
    });

    if (reporterOrError.isLeft()) {
      return presenter.failure(reporterOrError.value);
    }

    const reporter = reporterOrError.value;
    const isAlreadyRegistered = await repository.emailExists(reporter.email);

    if (isAlreadyRegistered) {
      return presenter.failure(new EmailAlreadyRegisteredError(reporter.email));
    }

    reporter.password = encoder.encode(reporter.password);
    await repository.save(reporter);

    return presenter.success({
      reporterId: id.value,
      avatar: avatarURL,
    });
  }
}

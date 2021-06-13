import { Admin } from '@entities/admin/admin';
import { IdGenerator } from '@use-cases/interfaces/adapters/id-generator';
import { PasswordEncoder } from '@use-cases/interfaces/adapters/password-encoder';
import { UseCaseInputPort } from '@use-cases/interfaces/ports/use-case-input-port';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';
import { EmailAlreadyRegisteredError } from '@use-cases/shared/errors/email-already-registered-error';
import { RegisterAdminRequest as Request } from './dtos/register-admin-request';
import { RegisterAdminResponse as Response } from './dtos/register-admin-response';

interface Dependencies {
  adminRepo: AdminRepository;
  encoder: PasswordEncoder;
  idGenerator: IdGenerator;
  presenter: UseCaseOutputPort<Response>;
}

export class RegisterAdminUseCase implements UseCaseInputPort<Request> {
  constructor(private readonly dependencies: Dependencies) {}

  async execute(request: Request): Promise<void> {
    const { idGenerator, presenter, encoder, adminRepo } = this.dependencies;

    const adminOrError = Admin.create({
      avatar: request.avatar,
      createdAt: new Date(),
      email: request.email,
      id: idGenerator.generate().value,
      name: request.name,
      password: request.password,
    });

    if (adminOrError.isLeft()) {
      return presenter.failure(adminOrError.value);
    }

    const admin = adminOrError.value;

    const isAlreadyRegistered = await adminRepo.emailExists(admin.email);
    if (isAlreadyRegistered) {
      return presenter.failure(new EmailAlreadyRegisteredError(admin.email));
    }

    admin.password = encoder.encode(admin.password);

    await adminRepo.save(admin);

    return presenter.success({
      adminId: admin.id.value,
    });
  }
}

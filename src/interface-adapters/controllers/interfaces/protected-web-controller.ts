import { Id } from '@entities/shared/id/id';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { UseCaseInputPort } from '@use-cases/interfaces/ports/use-case-input-port';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { InternalServerError } from '../errors/internal-server-error';
import { AuthorizationService } from './authorization-service';
import { ErrorLogger } from './error-logger';
import { HttpController } from './http-controller';

export abstract class ProtectedWebController<T> implements HttpController {
  constructor(
    private readonly authorizer: AuthorizationService,
    private readonly errorLogger: ErrorLogger,
    private readonly useCase: UseCaseInputPort<T>,
    private readonly presenter: UseCaseOutputPort<any>,
  ) {}

  async handle(request: HttpRequest): Promise<void> {
    try {
      const authHeader = request.getHeader<string>('authorization') ?? '';
      const credentials = authHeader.replace('Bearer ', '');
      const ownerIdOrError = await this.authorizer.validate(credentials);

      if (ownerIdOrError.isLeft()) {
        return this.presenter.failure(ownerIdOrError.value);
      }

      const ownerId = ownerIdOrError.value;
      const useCaseRequest = this.getParamsFromHttpRequest(request, ownerId);

      return await this.useCase.execute(useCaseRequest);
    } catch (error) {
      await this.errorLogger.log(error);
      return this.presenter.failure(new InternalServerError());
    }
  }

  protected abstract getParamsFromHttpRequest(
    request: HttpRequest,
    requesterId: Id,
  ): T;
}

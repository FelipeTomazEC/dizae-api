import { HttpRequest } from '@interface-adapters/http/http-request';
import { UseCaseInputPort } from '@use-cases/interfaces/ports/use-case-input-port';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { AuthorizationError } from './errors/authorization-error';
import { InternalServerError } from './errors/internal-server-error';
import { AuthorizationService } from './interfaces/authorization-service';
import { ErrorLogger } from './interfaces/error-logger';
import { HttpController } from './interfaces/http-controller';

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
      const isTheCredentialsValid = await this.authorizer.validate(credentials);

      if (!isTheCredentialsValid) {
        return this.presenter.failure(new AuthorizationError());
      }

      const useCaseRequest = this.getParamsFromHttpRequest(request);
      return await this.useCase.execute(useCaseRequest);
    } catch (error) {
      await this.errorLogger.log(error);
      return this.presenter.failure(new InternalServerError());
    }
  }

  abstract getParamsFromHttpRequest(request: HttpRequest): T;
}

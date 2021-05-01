import { HttpRequest } from '@interface-adapters/http/http-request';
import { UseCaseInputPort } from '@use-cases/interfaces/ports/use-case-input-port';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { InternalServerError } from '../errors/internal-server-error';
import { ErrorLogger } from './error-logger';
import { HttpController } from './http-controller';

export abstract class WebController<T> implements HttpController {
  constructor(
    private readonly errorLogger: ErrorLogger,
    private readonly useCase: UseCaseInputPort<T>,
    private readonly presenter: UseCaseOutputPort<any>,
  ) {}

  async handle(request: HttpRequest): Promise<void> {
    try {
      const useCaseRequest = this.getParamsFromHttpRequest(request);
      return await this.useCase.execute(useCaseRequest);
    } catch (err) {
      await this.errorLogger.log(err);
      return this.presenter.failure(new InternalServerError());
    }
  }

  abstract getParamsFromHttpRequest(request: HttpRequest): T;
}

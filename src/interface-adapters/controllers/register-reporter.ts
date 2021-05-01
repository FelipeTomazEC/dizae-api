import { HttpRequest } from '@interface-adapters/http/http-request';
import { RegisterReporterRequest as Request } from '@use-cases/register-reporter/dtos/register-reporter-request';
import { WebController } from './interfaces/web-controller';

export class RegisterReporterController extends WebController<Request> {
  getParamsFromHttpRequest(request: HttpRequest): Request {
    const { avatar, email, name, password } = request.body;

    return { avatar, email, name, password };
  }
}

import { HttpRequest } from '@interface-adapters/http/http-request';
import { AuthenticateReporterRequest as Request } from '@use-cases/authenticate-reporter/dtos/authenticate-reporter-request';
import { WebController } from './interfaces/web-controller';

export class AuthenticateReporterController extends WebController<Request> {
  getParamsFromHttpRequest(request: HttpRequest): Request {
    return {
      email: request.body.email,
      password: request.body.password,
    };
  }
}

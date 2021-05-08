import { HttpRequest } from '@interface-adapters/http/http-request';
import { AuthenticationRequest as Request } from '@use-cases/shared/dtos/authentication-request';

import { WebController } from './interfaces/web-controller';

export class AuthenticationController extends WebController<Request> {
  getParamsFromHttpRequest(request: HttpRequest): Request {
    return {
      email: request.body.email,
      password: request.body.password,
    };
  }
}

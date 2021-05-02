import { RegisterAdminRequest as Request } from '@use-cases/register-admin/dtos/register-admin-request';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { ProtectedWebController } from './interfaces/protected-web-controller';

export class RegisterAdminController extends ProtectedWebController<Request> {
  getParamsFromHttpRequest(request: HttpRequest): Request {
    const { avatar, email, name, password } = request.body;

    return { avatar, email, name, password };
  }
}

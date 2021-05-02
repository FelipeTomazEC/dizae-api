import { HttpRequest } from '@interface-adapters/http/http-request';
import { CreateLocationRequest as Request } from '@use-cases/create-location/dtos/create-location-request';
import { ProtectedWebController } from './interfaces/protected-web-controller';

export class CreateLocationController extends ProtectedWebController<Request> {
  getParamsFromHttpRequest(request: HttpRequest): Request {
    return {
      adminId: request.body.adminId,
      name: request.body.name,
    };
  }
}

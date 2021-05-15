import { Id } from '@entities/shared/id/id';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { CreateLocationRequest as Request } from '@use-cases/create-location/dtos/create-location-request';
import { ProtectedWebController } from './interfaces/protected-web-controller';

export class CreateLocationController extends ProtectedWebController<Request> {
  getParamsFromHttpRequest(request: HttpRequest, requesterId: Id): Request {
    return {
      adminId: requesterId.value,
      name: request.body.name,
    };
  }
}

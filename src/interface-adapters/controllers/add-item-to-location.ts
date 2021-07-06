import { Id } from '@entities/shared/id/id';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { AddItemToLocationRequest as Request } from '@use-cases/add-item-to-location/dtos/add-item-to-location-request';
import { ProtectedWebController } from './interfaces/protected-web-controller';

export class AddItemToLocationController extends ProtectedWebController<Request> {
  getParamsFromHttpRequest(request: HttpRequest, requesterId: Id): Request {
    const locationId = request.getParam<string>('location_id');
    const { name, categoryName, image } = request.body;
    const adminId = requesterId.value;

    return { adminId, name, categoryName, image, locationId };
  }
}

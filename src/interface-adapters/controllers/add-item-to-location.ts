import { HttpRequest } from '@interface-adapters/http/http-request';
import { AddItemToLocationRequest as Request } from '@use-cases/add-item-to-location/dtos/add-item-to-location-request';
import { ProtectedWebController } from './interfaces/protected-web-controller';

export class AddItemToLocationController extends ProtectedWebController<Request> {
  getParamsFromHttpRequest(request: HttpRequest): Request {
    const locationId = request.getParam<string>('locationId');
    const { name, categoryName, adminId, image } = request.body;

    return { adminId, name, categoryName, image, locationId };
  }
}

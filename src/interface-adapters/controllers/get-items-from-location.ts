import { HttpRequest } from '@interface-adapters/http/http-request';
import { GetItemsFromLocationRequest as Request } from '@use-cases/get-items-from-location/dtos/get-items-from-location-request';
import { WebController } from './interfaces/web-controller';

export class GetItemsFromLocationController extends WebController<Request> {
  getParamsFromHttpRequest(request: HttpRequest): Request {
    return {
      locationId: request.getParam<string>('locationId'),
    };
  }
}

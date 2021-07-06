import { HttpRequest } from '@interface-adapters/http/http-request';
import { GetLocationInfoRequest as Request } from '@use-cases/get-location-info/dtos/get-location-info-request';
import { WebController } from './interfaces/web-controller';

export class GetLocationInfoController extends WebController<Request> {
  getParamsFromHttpRequest(request: HttpRequest): Request {
    return {
      locationId: request.getParam<string>('location_id'),
    };
  }
}

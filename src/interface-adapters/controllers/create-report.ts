import { HttpRequest } from '@interface-adapters/http/http-request';
import { CreateReportRequest as Request } from '@use-cases/create-report/dtos/create-report-request';
import { ProtectedWebController } from './protected-web-controller';

export class CreateReportController extends ProtectedWebController<Request> {
  getParamsFromHttpRequest(request: HttpRequest): Request {
    return {
      description: request.body.description,
      image: request.body.image,
      itemName: request.body.itemName,
      locationId: request.getParam('locationId'),
      reporterId: request.body.reporterId,
      title: request.body.title,
    };
  }
}

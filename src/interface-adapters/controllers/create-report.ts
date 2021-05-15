import { Id } from '@entities/shared/id/id';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { CreateReportRequest as Request } from '@use-cases/create-report/dtos/create-report-request';
import { ProtectedWebController } from './interfaces/protected-web-controller';

export class CreateReportController extends ProtectedWebController<Request> {
  getParamsFromHttpRequest(request: HttpRequest, requesterId: Id): Request {
    const { description, title, image, itemName, locationId } = request.body;

    return {
      description,
      image,
      title,
      itemName,
      locationId,
      reporterId: requesterId.value,
    };
  }
}

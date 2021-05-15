import { Id } from '@entities/shared/id/id';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { CreateItemCategoryRequest as Request } from '@use-cases/create-item-category/dtos/create-item-category-request';
import { ProtectedWebController } from './interfaces/protected-web-controller';

export class CreateItemCategoryController extends ProtectedWebController<Request> {
  getParamsFromHttpRequest(request: HttpRequest, requesterId: Id): Request {
    return {
      adminId: requesterId.value,
      name: request.body.name,
    };
  }
}

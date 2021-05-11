import { HttpRequest } from '@interface-adapters/http/http-request';
import { CreateItemCategoryRequest as Request } from '@use-cases/create-item-category/dtos/create-item-category-request';
import { ProtectedWebController } from './interfaces/protected-web-controller';

export class CreateItemCategoryController extends ProtectedWebController<Request> {
  getParamsFromHttpRequest(request: HttpRequest): Request {
    return {
      adminId: request.body.adminId,
      name: request.body.name,
    };
  }
}

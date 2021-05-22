import { WebController } from './interfaces/web-controller';

export class GetItemCategoriesController extends WebController<void> {
  getParamsFromHttpRequest(): void {
    return undefined;
  }
}

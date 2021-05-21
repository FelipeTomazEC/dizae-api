import { WebController } from './interfaces/web-controller';

export class GetAllLocationsInfoController extends WebController<void> {
  getParamsFromHttpRequest(): void {
    return undefined;
  }
}

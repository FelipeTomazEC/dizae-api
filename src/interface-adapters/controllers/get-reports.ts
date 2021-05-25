/* eslint-disable no-restricted-globals */
import { Status } from '@entities/report/status';
import { Id } from '@entities/shared/id/id';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { GetReportsRequest as Request } from '@use-cases/get-reports/dtos/get-reports-request';
import { ProtectedWebController } from './interfaces/protected-web-controller';

export class GetReportsController extends ProtectedWebController<Request> {
  getParamsFromHttpRequest(request: HttpRequest, requesterId: Id): Request {
    const locationsIds = request.getQueryParam<string>('locations_ids');
    const status = request.getQueryParam<string>('status');
    const since = request.getQueryParam<number>('since');
    const start = request.getQueryParam<number>('start') ?? 0;
    const offset = request.getQueryParam<number>('offset') ?? 50;
    const itemCategories = request.getQueryParam<string>('item_categories');
    const validStatus = [Status.PENDING, Status.REJECTED, Status.SOLVED];

    return {
      requesterId: requesterId.value,
      itemCategories: itemCategories?.split(',').map((i) => i.trim()),
      locationsIds: locationsIds?.split(',').map((i) => i.trim()),
      pagination: { start, offset },
      since: !isNaN(since!) ? since : undefined,
      status: status
        ?.split(',')
        .map((s) => Number(s))
        .filter((s) => validStatus.some((st) => st === s)),
    };
  }
}

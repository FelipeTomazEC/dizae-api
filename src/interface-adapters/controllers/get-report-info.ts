import { Id } from '@entities/shared/id/id';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { GetSingleReportRequest as Request } from '@use-cases/get-single-report/dtos/get-single-report-request';
import { ProtectedWebController } from './interfaces/protected-web-controller';

export class GetReportInfoController extends ProtectedWebController<Request> {
  protected getParamsFromHttpRequest(
    request: HttpRequest,
    requesterId: Id,
  ): Request {
    const reportId = request.getParam<string>('report_id');

    return {
      reportId,
      requesterId: requesterId.value,
    };
  }
}

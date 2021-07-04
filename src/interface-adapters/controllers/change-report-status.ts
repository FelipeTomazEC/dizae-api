import { HttpRequest } from '@interface-adapters/http/http-request';
import { ChangeReportStatusRequest as Request } from '@use-cases/change-report-status/dtos/change-report-status-request';
import { ProtectedWebController } from './interfaces/protected-web-controller';

export class ChangeReportStatusController extends ProtectedWebController<Request> {
  protected getParamsFromHttpRequest(request: HttpRequest): Request {
    return {
      newStatus: request.body.status,
      reportId: request.getParam<string>('report_id'),
    };
  }
}

import { HttpResponse } from '@interface-adapters/http/http-response';
import { HttpStatusCode } from '@interface-adapters/http/http-status-code';
import { BaseError } from '@shared/errors/base-error';
import { ErrorType } from '@shared/errors/error-type.enum';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';

export class HttpPresenter<T> implements UseCaseOutputPort<T> {
  constructor(
    private readonly callback: (response: HttpResponse) => void,
    private readonly successStatus: HttpStatusCode,
  ) {}

  success(response: T): void {
    const httpResponse = new HttpResponse({
      body: {
        success: true,
        data: response,
      },
      statusCode: this.successStatus,
    });

    return this.callback(httpResponse);
  }

  failure(error: BaseError): void {
    const httpResponse = new HttpResponse({
      body: {
        success: false,
        error: {
          message: error.message,
        },
      },
      statusCode: HttpPresenter.httpStatusCodeFromErrorType(error.type),
    });

    this.callback(httpResponse);
  }

  private static httpStatusCodeFromErrorType(type: ErrorType): HttpStatusCode {
    switch (type) {
      case ErrorType.INVALID_INPUT_ERROR:
      case ErrorType.MISSING_REQUIRED_PARAM:
        return HttpStatusCode.BAD_REQUEST;
      case ErrorType.AUTHENTICATION_ERROR:
        return HttpStatusCode.UNAUTHORIZED;
      case ErrorType.AUTHORIZATION_ERROR:
        return HttpStatusCode.FORBIDDEN;
      case ErrorType.DUPLICATED_RESOURCE:
        return HttpStatusCode.CONFLICT;
      case ErrorType.RESOURCE_NOT_FOUND_ERROR:
        return HttpStatusCode.NOT_FOUND;
      default:
        return HttpStatusCode.SERVER_ERROR;
    }
  }
}

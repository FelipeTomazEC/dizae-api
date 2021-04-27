import { HttpResponse } from '@interface-adapters/http/http-response';
import { HttpStatusCode } from '@interface-adapters/http/http-status-code';
import { HttpPresenter } from '@interface-adapters/presenters/http-presenter';
import { BaseError } from '@shared/errors/base-error';
import { ErrorType } from '@shared/errors/error-type.enum';

describe('Http presenter tests.', () => {
  const callback = jest.fn();
  const sut = new HttpPresenter<any>(callback, HttpStatusCode.OK);

  it('should map a success response to the specified code.', () => {
    sut.success({ value: 1, prop: 2 });

    expect(callback).toBeCalledWith(
      new HttpResponse({
        body: { success: true, data: { value: 1, prop: 2 } },
        statusCode: HttpStatusCode.OK,
        headers: [],
      }),
    );
  });

  it('should map an invalid user input to status code 400.', () => {
    const error: BaseError = {
      message: 'Some error message',
      name: 'error-here',
      type: ErrorType.INVALID_INPUT_ERROR,
    };

    sut.failure(error);

    expect(callback).toBeCalledWith(
      new HttpResponse({
        body: {
          success: false,
          error: {
            message: 'Some error message',
          },
        },
        statusCode: HttpStatusCode.BAD_REQUEST,
      }),
    );
  });

  it('should map an internal server error to status code 500.', () => {
    const error: BaseError = {
      message: 'Some error message',
      name: 'error-here',
      type: ErrorType.INTERNAL_SERVER_ERROR,
    };

    sut.failure(error);

    expect(callback).toBeCalledWith(
      new HttpResponse({
        body: {
          success: false,
          error: {
            message: 'Some error message',
          },
        },
        statusCode: HttpStatusCode.SERVER_ERROR,
      }),
    );
  });

  it('should map an authorization error to status code 403.', () => {
    const error: BaseError = {
      message: 'Some error message',
      name: 'error-here',
      type: ErrorType.AUTHORIZATION_ERROR,
    };

    sut.failure(error);

    expect(callback).toBeCalledWith(
      new HttpResponse({
        body: {
          success: false,
          error: {
            message: 'Some error message',
          },
        },
        statusCode: HttpStatusCode.FORBIDDEN,
      }),
    );
  });

  it('should map an authentication error to status code 401', () => {
    const error: BaseError = {
      message: 'Some error message',
      name: 'error-here',
      type: ErrorType.AUTHENTICATION_ERROR,
    };

    sut.failure(error);

    expect(callback).toBeCalledWith(
      new HttpResponse({
        body: {
          success: false,
          error: {
            message: 'Some error message',
          },
        },
        statusCode: HttpStatusCode.UNAUTHORIZED,
      }),
    );
  });

  it('should map a duplicated resource error to status code 409.', () => {
    const error: BaseError = {
      message: 'Some error message',
      name: 'error-here',
      type: ErrorType.DUPLICATED_RESOURCE,
    };

    sut.failure(error);

    expect(callback).toBeCalledWith(
      new HttpResponse({
        body: {
          success: false,
          error: {
            message: 'Some error message',
          },
        },
        statusCode: HttpStatusCode.CONFLICT,
      }),
    );
  });

  it('should map a not found resource error to status code 404.', () => {
    const error: BaseError = {
      message: 'Some error message',
      name: 'error-here',
      type: ErrorType.RESOURCE_NOT_FOUND_ERROR,
    };

    sut.failure(error);

    expect(callback).toBeCalledWith(
      new HttpResponse({
        body: {
          success: false,
          error: {
            message: 'Some error message',
          },
        },
        statusCode: HttpStatusCode.NOT_FOUND,
      }),
    );
  });
});

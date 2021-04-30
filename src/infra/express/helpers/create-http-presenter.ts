import { HttpResponse } from '@interface-adapters/http/http-response';
import { HttpStatusCode } from '@interface-adapters/http/http-status-code';
import { HttpPresenter } from '@interface-adapters/presenters/http-presenter';
import { Response } from 'express';

export const createHttpPresenter = (
  res: Response,
  successStatusCode = HttpStatusCode.OK,
): HttpPresenter<any> => {
  const callback = (response: HttpResponse) => {
    const { statusCode, body, headers } = response;
    headers.forEach((header) => res.setHeader(header.name, header.value));
    res.status(statusCode);

    return res.json(body);
  };

  return new HttpPresenter(callback, successStatusCode);
};

import { parseToHttpRequest } from '@infra/express/helpers/parse-to-http-request';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { Request } from 'express';

describe('Express request parser tests', () => {
  it('should parse the express request to a HTTP Request', () => {
    const expressRequest: Partial<Request> = {
      method: 'PUT',
      body: {
        string: 'string',
        number: 2,
        boolean: true,
        object: {
          prop1: 1,
          prop2: 'foo',
        },
      },
      params: {
        param1: 'value1',
        param2: 'value2',
      },
      query: {
        qParam1: 'value1',
        qParam2: 'value2',
      },
      headers: {
        authorization: 'Bearer some-token-here',
        someHeader: 'foo',
      },
    };

    const request = new HttpRequest({
      method: 'PUT',
      body: {
        string: 'string',
        number: 2,
        boolean: true,
        object: {
          prop1: 1,
          prop2: 'foo',
        },
      },
      params: [
        { name: 'param1', value: 'value1' },
        { name: 'param2', value: 'value2' },
      ],
      query: [
        { name: 'qParam1', value: 'value1' },
        { name: 'qParam2', value: 'value2' },
      ],
      headers: [
        { name: 'authorization', value: 'Bearer some-token-here' },
        { name: 'someHeader', value: 'foo' },
      ],
    });

    expect(parseToHttpRequest(expressRequest as Request)).toStrictEqual(
      request,
    );
  });
});

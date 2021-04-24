import { ResponseBody, HeaderCollection, HeaderValue } from './types';

interface Props {
  body: ResponseBody;
  statusCode: number;
  headers?: HeaderCollection;
}

export class HttpResponse {
  public readonly body: ResponseBody;

  public readonly headers: HeaderCollection;

  public readonly statusCode: number;

  constructor(props: Props) {
    this.body = props.body;
    this.headers = props.headers ?? [];
    this.statusCode = props.statusCode;
  }

  public getHeader(name: string): HeaderValue | undefined {
    return this.headers.find((h) => h.name === name)?.value;
  }
}

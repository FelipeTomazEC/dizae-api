import {
  RequestBody,
  HeaderCollection,
  ParamCollection,
  HttpMethod,
} from './types';

interface Props {
  body: RequestBody;
  headers: HeaderCollection;
  params: ParamCollection;
  query: ParamCollection;
}

export class HttpRequest {
  public readonly body: RequestBody;

  private readonly headers: HeaderCollection;

  public readonly method: HttpMethod;

  private readonly params: ParamCollection;

  private readonly query: ParamCollection;

  constructor(props: Partial<Props> & { method: HttpMethod }) {
    this.body = props.body ?? {};
    this.headers = props.headers ?? [];
    this.method = props.method;
    this.params = props.params ?? [];
    this.query = props.query ?? [];
  }

  public getHeader<T>(name: string): T {
    return (this.headers.find((h) => h.name === name)?.value as unknown) as T;
  }

  public getParam<T>(name: string): T {
    return (this.params.find((p) => p.name === name)?.value as unknown) as T;
  }

  public getQueryParam<T>(name: string): T {
    return (this.query.find((p) => p.name === name)?.value as unknown) as T;
  }
}

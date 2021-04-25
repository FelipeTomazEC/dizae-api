import { HttpRequest } from '@interface-adapters/http/http-request';

export interface HttpController {
  handle(request: HttpRequest): Promise<void>;
}

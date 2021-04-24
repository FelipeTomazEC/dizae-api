export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type HeaderValue = string | string[] | number;
export type ParamValue = string | number;
export type HeaderCollection = Header[];
export type ParamCollection = Param[];

interface Header {
  name: string;
  value: HeaderValue;
}

interface Param {
  name: string;
  value: ParamValue;
}

interface MappedError {
  type: string;
  message: string;
  info?: string;
}

export interface RequestBody {
  readonly [index: string]: any;
}

export interface ResponseBody {
  success: boolean;
  data?: any;
  error?: MappedError;
}

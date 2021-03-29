import {BaseError} from "./base-error";
import {ErrorCode} from "./error-code.enum";

export class MissingParamError extends BaseError {
  constructor(paramName: string) {
    super(ErrorCode.MISSING_PARAM, `The param ${paramName} is required.`);
  }
}
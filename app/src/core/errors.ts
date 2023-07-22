import { isPlainObject } from 'lodash';

export enum ErrorCode {
  UNKNOWN = 'UNKNOWN',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_PARAMETERS = 'INVALID_PARAMETERS',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL = 'INTERNAL',
}

export type TResponseError = {
  code: ErrorCode;
  message: string;
  details: any;
};

export type TValidationError = {
  msg: string;
  param: string;
  value: any;
};

export function isResponseError(error: any): error is TResponseError {
  return (isPlainObject(error) && ['code', 'message', 'details'].every((key) => key in error));
}

import { ValidationError } from 'express-validator';

export enum ErrorCode {
  UNKNOWN = 'UNKNOWN',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_PARAMETERS = 'INVALID_PARAMETERS',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL = 'INTERNAL',
}

export abstract class ResponseError {
  httpCode: number;
  message: string;
  details: any;
  code: ErrorCode;

  protected constructor(httpCode: number = 500, message: string = 'Error has occurred.', details: any | null = null, code: ErrorCode = ErrorCode.UNKNOWN) {
    this.httpCode = httpCode;
    this.message = message;
    this.details = details;
    this.code = code;
  }
}

export class BadRequestError extends ResponseError {
  constructor(message = 'Bad request.') {
    super(400, message, null, ErrorCode.BAD_REQUEST);
  }
}

export class UnauthorizedError extends ResponseError {
  constructor(message = 'Unauthorized.') {
    super(401, message, null, ErrorCode.UNAUTHORIZED);
  }
}

export class InvalidParametersError extends ResponseError {
  constructor(details: ValidationError[]) {
    super(400, 'Invalid parameters.', details, ErrorCode.INVALID_PARAMETERS);
  }
}

export class ForbiddenError extends ResponseError {
  constructor(message = 'Forbidden.') {
    super(403, message, null, ErrorCode.FORBIDDEN);
  }
}

export class NotFoundError extends ResponseError {
  constructor(message = 'Not found.') {
    super(404, message, null, ErrorCode.NOT_FOUND);
  }
}

export class InternalError extends ResponseError {
  constructor(message = 'Internal error.') {
    super(500, message, null, ErrorCode.INTERNAL);
  }
}

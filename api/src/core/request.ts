import { Request, Response, NextFunction } from 'express';
import { ValidationChain, ValidationError, validationResult } from 'express-validator';
import { isFunction } from 'lodash';
import isBefore from 'date-fns/isBefore';

import { ResponseError, UnauthorizedError, InvalidParametersError, ErrorCode } from './errors';
import { getUser } from '../repos/users';
import { getSession } from '../services/session';

interface IRequest<TParams extends Array<string>, TBody> extends Request<Record<TParams[number], string>, any, TBody> {}

type TMethod = 'get' | 'post' | 'put' | 'delete';

type TSession = {
  userId: string; // logged user id
  // ... some other session properties ...
};

type TMeta<TParams extends Array<string>, TBody> = {
  req: IRequest<TParams, TBody>;
  res: Response;
};

type TRestrictedMeta<TParams extends Array<string>, TBody> = TMeta<TParams, TBody> & { session: TSession };

type TRestrictedOptions<TData, TParams extends Array<string>, TBody> = {
  restricted: true;
  validations?: ValidationChain[] | ((meta: TRestrictedMeta<TParams, TBody>) => ValidationChain[]);
  callback: (meta: TRestrictedMeta<TParams, TBody>) => Promise<TData> | TData;
};

type TPublicOptions<TData, TParams extends Array<string>, TBody> = {
  restricted?: false;
  validations?: ValidationChain[] | ((meta: TMeta<TParams, TBody>) => ValidationChain[]);
  callback: (meta: TMeta<TParams, TBody>) => Promise<TData> | TData;
};

type TRouteOptions<TData, TParams extends Array<string>, TBody> =
  {
    method: TMethod,
    path: string;
  } &
  (
    TRestrictedOptions<TData, TParams, TBody> |
    TPublicOptions<TData, TParams, TBody>
  );

type TRoute<TParams extends Array<string>, TBody> = {
  method: TMethod;
  path: string;
  respond: (req: IRequest<TParams, TBody>, res: Response, next: NextFunction) => any;
};

// function verify(token: string): JwtPayload | null {
//   try {
//     const payload = jwt.verify(token, config.session.secret);
//     return isString(payload) ? null : payload;
//   } catch (err) {
//     return null;
//   }
// }

async function authenticate(req: Request): Promise<TSession> {
  const header = req.header('Authorization');
  if (!header) {
    throw new UnauthorizedError('Invalid header.');
  }

  const token = header.replace('Bearer ', '');
  if (!token) {
    throw new UnauthorizedError('Invalid token.');
  }

  const session = getSession(token);
  if (!session) {
    throw new UnauthorizedError('Incorrect session.');
  }

  const user = await getUser(session.userId);
  if (!user) {
    throw new UnauthorizedError('User does not exist.');
  }

  if (isBefore(new Date(session.authedAt), user.authedAt as Date)) { // user.authedAt MUST have a non-empty date at this stage (by design)
    throw new UnauthorizedError('Session expired.');
  }

  return session;
}

async function validate(req: Request, validations: ValidationChain[]): Promise<void> {
  await Promise.all(validations.map(validation => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map(({ value, msg, param }) => ({ value, msg, param })) as ValidationError[];
    throw new InvalidParametersError(details);
  }
}

function sendError(res: Response, { httpCode, code, message, details }: ResponseError) {
  res
    .status(httpCode)
    .json({
      error: { code, message, details },
    });
}

export function route<TData, TParams extends Array<string> = [], TBody = any>(
  { method, path, restricted, validations, callback }: TRouteOptions<TData, TParams, TBody>
): TRoute<TParams, TBody> {
  return {
    method,
    path,
    respond: async (req, res, next) => {
      try {
        const data = await (async () => {
          if (restricted) {
            const session = await authenticate(req);
            validations && await validate(req, isFunction(validations) ? validations({ req, res, session }) : validations);
            return callback({ req, res, session });
          }
          validations && await validate(req, isFunction(validations) ? validations({ req, res }) : validations);
          return callback({ req, res });
        })();
        if (!res.headersSent) {
          res.json({ data });
        }
      } catch (err) {
        if (err instanceof ResponseError) {
          return sendError(res, err);
        }
        next(err);
      }
    },
  };
}

export function handleUnexpectedError(err: any, req: Request, res: Response, next: NextFunction) {
  const x = 0;
  sendError(res, {
    httpCode: 500,
    code: ErrorCode.UNKNOWN,
    message: 'Unexpected error.',
    details: null,
  });
}

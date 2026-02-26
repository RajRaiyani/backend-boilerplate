import type { NextFunction, Request, Response } from 'express';

import  { ErrorCodes } from '@/config/constant.js';
import { ValidationError } from '@/middleware/requestValidator.js';
import Logger from '@/service/logger/index.js';
import ServerError from '@/core/ServerError.class.js';


const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

  if (err instanceof ValidationError) {
    Logger.warn({ message: 'validation error', stack: JSON.stringify(err.details) });
    return res.status(400).json({ code: 'validation_error', details: err.details, message: err.message });
  }

  if (err instanceof ServerError) {
    const errorInfo = err.info();
    if (errorInfo) return res.status(errorInfo.httpStatusCode).json(errorInfo.body);
  }

  // Postgres error handling
  if (ErrorCodes.postgres[err.code]) {
    const {
      code, constraint, httpStatusCode, message
    } = ErrorCodes.postgres[err.code];

    return res.status(httpStatusCode).json({
      code,
      message: constraint[err.constraint] || message,
    });
  }

  Logger.error(err.message || err.code, { stack: err.stack });

  return res.status(500).json({
    code: 'internal_server_error',
    details: {
      developer: {
        message: err.message || 'Internal server error',
        stack: err.stack,
      },
    },
    message: 'Internal server error',
  });
};

export default errorHandler;

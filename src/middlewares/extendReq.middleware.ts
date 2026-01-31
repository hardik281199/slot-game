import { NextFunction, Request, Response } from 'express';
import { MESSAGES, HTTP_STATUS } from '../constants/messages';

function getMessage(key: string): string {
  return MESSAGES[key] ?? key;
}

export function extendReqMiddleware() {
  return (_req: Request, res: Response, next: NextFunction) => {
    res.ok = (payload = {}) => {
      if (typeof payload === 'string') {
        return res.status(HTTP_STATUS.OK).send({
          isError: false,
          message: getMessage(payload),
          data: {},
        });
      }
      const { message = 'OK', data = {} } = payload;
      return res.status(HTTP_STATUS.OK).send({
        isError: false,
        message: getMessage(message),
        data: data ?? {},
      });
    };

    res.error = (messageOrPayload: string | { message?: string; statusCode?: number; data?: unknown }, data?: unknown) => {
      if (typeof messageOrPayload === 'string') {
        return res.status(HTTP_STATUS.VALIDATION_ERROR).send({
          isError: true,
          message: getMessage(messageOrPayload),
          data: data ?? {},
        });
      }
      const { message = 'ERROR', statusCode = HTTP_STATUS.VALIDATION_ERROR, data: payloadData = {} } = messageOrPayload;
      return res.status(statusCode).send({
        isError: true,
        message: getMessage(message),
        data: payloadData ?? {},
      });
    };

    res.unauthorized = (message = 'FAILED_AUTHENTICATION') => {
      return res.status(HTTP_STATUS.UNAUTHENTICATION).send({
        isError: true,
        message: getMessage(message),
        data: {},
      });
    };

    res.notFound = (message = 'NOT_FOUND') => {
      return res.status(HTTP_STATUS.NOT_FOUND).send({
        isError: true,
        message: getMessage(message),
        data: {},
      });
    };

    res.validationError = (payload: { message?: string; data?: unknown }) => {
      const { message = 'GAME_VARIABLE_ERROR', data = {} } = payload;
      return res.status(HTTP_STATUS.VALIDATION_ERROR).send({
        isError: true,
        message: typeof message === 'string' ? getMessage(message) : message,
        data: data ?? {},
      });
    };

    next();
  };
}

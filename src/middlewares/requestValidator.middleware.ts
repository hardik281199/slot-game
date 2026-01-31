import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';

export const requestValidator = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const payload = { ...req.body, ...req.params, ...req.query };

    const valid = schema.validate(payload);
    if (valid.error) {
      const message = valid.error.details[0]?.message ?? 'GAME_VARIABLE_ERROR';
      return res.error(message);
    }

    req.validatedParams = valid.value;
    return next();
  };
};

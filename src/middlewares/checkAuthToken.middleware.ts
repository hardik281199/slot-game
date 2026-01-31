import { Response, NextFunction } from 'express';
import JsonWebToken from 'jsonwebtoken';
import { AuthenticatedRequest, JwtPayload } from '../types';

export const checkAuthToken = () => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void | boolean => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const bearerToken = authHeader.split(' ');
      if (bearerToken.length === 2 && bearerToken[0].toLowerCase() === 'bearer') {
        JsonWebToken.verify(
          bearerToken[1],
          process.env.JWT_SECRET as string,
          (error, token) => {
            if (error) {
              res.unauthorized('FAILED_AUTHENTICATION');
              return;
            }
            req.token = token as JwtPayload;
            next();
          }
        );
      } else {
        res.unauthorized('FAILED_AUTHENTICATION');
      }
    } else {
      res.unauthorized('FAILED_AUTHENTICATION');
    }
  };
};
